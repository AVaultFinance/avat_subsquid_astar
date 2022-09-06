import { Big as BigDecimal } from "big.js";
import {
  CommonHandlerContext,
  EvmLogHandlerContext,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { ADDRESS_ZERO, ZERO_BD } from "../../config/consts";
import { Burn, Mint, Transaction, User } from "../../model";
import { getPair } from "../../store/pair";
import { getTransaction } from "../../store/transaction";
import { transferEventAbi } from "../../utils/abi/abiUtils";
import { convertTokenToDecimal } from "../../utils/number";
import { getOrCreateToken } from "../token/getOrCreateToken";
import { updateLiquidityPosition } from "../../store/liquiditPosition";
import * as pairAbi from "../../abis/pair";
import { createLiquiditySnapShot } from "../../store/liquiditySnapShot";
async function isCompleteMint(
  ctx: CommonHandlerContext<Store>,
  mintId: string
): Promise<boolean> {
  return !!(
    await ctx.store.get(Mint, {
      where: {
        id: mintId,
      },
    })
  )?.sender;
}
export async function handleTransfer(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();
  const data = transferEventAbi.decode(ctx.event.args);
  if (data.to === ADDRESS_ZERO && data.value.toBigInt() === 1000n) {
    return;
  }
  const transactionHash = ctx.event.evmTxHash;
  let { from, to } = data;
  from = from.toLowerCase();
  to = to.toLowerCase();
  const pair = await getPair(ctx, contractAddress);
  if (!pair) return;
  const paitToken = await getOrCreateToken(ctx, contractAddress);
  const value = convertTokenToDecimal(
    data.value.toBigInt(),
    paitToken.decimals
  );
  let transaction = await getTransaction(ctx, ctx.event.evmTxHash);

  if (!transaction) {
    transaction = new Transaction({
      id: transactionHash,
      blockNumber: BigDecimal(ctx.block.height).toString(),
      timestamp: new Date(ctx.block.timestamp),
      mints: [],
      burns: [],
      swaps: [],
    });
    await ctx.store.save(transaction);
  }
  const { mints } = transaction;
  // mints
  if (from === ADDRESS_ZERO) {
    pair.totalSupply = BigDecimal(pair.totalSupply).plus(value).toString();
    if (!mints.length || (await isCompleteMint(ctx, mints[mints.length - 1]))) {
      const mint = new Mint({
        id: `${transactionHash}-${mints.length}`,
        transaction: transaction,
        pair,
        to,
        liquidity: value.toString(),
        timestamp: new Date(ctx.block.timestamp),
        amount0: ZERO_BD.toString(),
        amount1: ZERO_BD.toString(),
      });
      await ctx.store.save(mint);
      transaction.mints = mints.concat([mint.id]);
      await ctx.store.save(transaction);
    }
  }
  // burn
  if (to === ADDRESS_ZERO && from === pair.id) {
    pair.totalSupply = BigDecimal(pair.totalSupply).minus(value).toString();
    const { burns } = transaction;
    let burn: Burn;
    if (burns.length > 0) {
      const currentBurn = await ctx.store.get(Burn, burns[burns.length - 1]);
      if (currentBurn?.needsComplete) {
        burn = currentBurn;
      } else {
        burn = new Burn({
          id: `${transactionHash}-${burns.length}`,
          transaction,
          needsComplete: false,
          pair,
          liquidity: value.toString(),
          timestamp: new Date(ctx.block.timestamp),
        });
      }
    } else {
      burn = new Burn({
        id: `${transactionHash}-${burns.length}`,
        transaction,
        needsComplete: false,
        pair,
        liquidity: value.toString(),
        timestamp: new Date(ctx.block.timestamp),
      });
    }
    if (
      mints.length !== 0 &&
      !(await isCompleteMint(ctx, mints[mints.length - 1]))
    ) {
      const mint = await ctx.store.get(Mint, mints[mints.length - 1]);
      if (mint) {
        burn.feeTo = mint.to;
        burn.feeLiquidity = mint.liquidity;
      }
      await ctx.store.remove(Mint, mints[mints.length - 1]);
      mints.pop();
      transaction.mints = mints;
    }
    await ctx.store.save(burn);
    if (burn.needsComplete) {
      burns[burns.length - 1] = burn.id;
    } else {
      burns.push(burn.id);
    }
    transaction.burns = burns;
    await ctx.store.save(transaction);
  }
  if (from !== ADDRESS_ZERO && from !== pair.id) {
    let user = await ctx.store.get(User, from);
    if (!user) {
      user = new User({
        id: from,
        liquidityPositions: [],
        usdSwapped: ZERO_BD.toString(),
      });
      await ctx.store.save(user);
    }
    const position = await updateLiquidityPosition(ctx, pair, user);
    const pairContract = new pairAbi.Contract(ctx, contractAddress);

    position.liquidityTokenBalance = convertTokenToDecimal(
      (await pairContract.balanceOf(from)).toBigInt(),
      paitToken.decimals
    ).toString();
    await ctx.store.save(position);
    await createLiquiditySnapShot(ctx, pair, position);
  }

  if (to !== ADDRESS_ZERO && to !== pair.id) {
    let user = await ctx.store.get(User, to);
    if (!user) {
      user = new User({
        id: to,
        liquidityPositions: [],
        usdSwapped: ZERO_BD.toString(),
      });
      await ctx.store.save(user);
    }
    const position = await updateLiquidityPosition(ctx, pair, user);
    const pairContract = new pairAbi.Contract(ctx, contractAddress);
    position.liquidityTokenBalance = convertTokenToDecimal(
      (await pairContract.balanceOf(to)).toBigInt(),
      paitToken.decimals
    ).toString();
    await ctx.store.save(position);
    await createLiquiditySnapShot(ctx, pair, position);
  }
  await ctx.store.save(pair);
}
