import { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Bundle, Mint, Transaction, User } from "../../model";
import { getFactory } from "../../store/factory";
import {
  getPair,
  updatePairDayData,
  updatePairHourData,
} from "../../store/pair";
import { updateTokenDayData } from "../../store/token";
import { mintAbi } from "../../utils/abi/abiUtils";
import { convertTokenToDecimal } from "../../utils/number";
import { createLiquidityPosition } from "../../store/liquiditPosition";
import { createLiquiditySnapShot } from "../../store/liquiditySnapShot";
import { getBundle } from "../../store/bundle";
import { updateFactoryDayData } from "../../store/factoryDayData";
import { getOrCreateToken } from "../token/getOrCreateToken";

export async function handleMint(
  ctx: EvmLogHandlerContext<Store>
): Promise<void> {
  const transaction = await ctx.store.get(Transaction, ctx.event.evmTxHash);
  // safety check
  if (!transaction) return;
  const { mints } = transaction;

  const mint = (await ctx.store.get(Mint, mints[mints.length - 1]))!;

  const contractAddress = ctx.event.args.address;

  const data = mintAbi.decode(ctx.event.args);
  const pair = await getPair(ctx, contractAddress);
  if (!pair) return;
  const factory_address = pair.factoryAddress;
  const factory = await getFactory(ctx, factory_address);
  if (!factory) return;
  const { token0Address, token1Address } = pair;
  const token0 = await getOrCreateToken(ctx, token0Address);
  const token1 = await getOrCreateToken(ctx, token1Address);
  token0.txCount += 1;
  token1.txCount += 1;

  // update exchange info (except balances, sync will cover that)
  const token0Amount = convertTokenToDecimal(
    data.amount0.toBigInt(),
    token0.decimals
  );
  const token1Amount = convertTokenToDecimal(
    data.amount1.toBigInt(),
    token1.decimals
  );

  const bundle = (await ctx.store.get(Bundle, "1"))!;
  const amountTotalUSD = BigDecimal(token1.derivedNative)
    .times(token1Amount)
    .plus(BigDecimal(token0.derivedNative).times(token0Amount))
    .times(bundle.nativePrice);

  pair.txCount += 1;
  factory.txCount += 1;

  await ctx.store.save(token0);
  await ctx.store.save(token1);
  await ctx.store.save(pair);
  await ctx.store.save(factory);

  mint.sender = data.sender;
  mint.amount0 = token0Amount.toString();
  mint.amount1 = token1Amount.toString();
  mint.logIndex = ctx.event.indexInBlock;
  mint.amountUSD = amountTotalUSD.toString();
  mint.transaction = transaction;
  mint.pair = pair;
  await ctx.store.save(mint);

  const user = (await ctx.store.get(User, mint.to))!;
  // update the LP position
  const liquidityPosition = createLiquidityPosition(pair, user);
  await createLiquiditySnapShot(ctx, pair, liquidityPosition);

  // update day entities
  await updatePairDayData(ctx);
  await updatePairHourData(ctx);
  await updateFactoryDayData(ctx, factory_address);
  await updateTokenDayData(ctx, token0);
  await updateTokenDayData(ctx, token1);
}
