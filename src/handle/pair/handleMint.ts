import { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Mint, Transaction, User } from "../../model";
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

export async function handleMint(
  ctx: EvmLogHandlerContext<Store>
): Promise<void> {
  // 当前交易hash
  const transaction = await ctx.store.get(Transaction, ctx.event.evmTxHash);
  if (!transaction) return;
  // 当前交易存储的mint数据
  const { mints } = transaction;
  const mint = (await ctx.store.get(Mint, mints[mints.length - 1]))!;

  const contractAddress = ctx.event.args.address.toLowerCase();
  const pair = await getPair(ctx, contractAddress);
  if (!pair) return;

  ctx.log.error(` mint.pair.factory---: ${mint?.pair?.factoryAddress}`);

  const factory_address = mint?.pair?.factoryAddress;
  if (!factory_address) return;
  const data = mintAbi.decode(ctx.event.args);
  const factory = await getFactory(ctx, factory_address);
  if (!factory) return;

  const { token0, token1 } = pair;
  token0.txCount += 1;
  token1.txCount += 1;

  const token0Amount = convertTokenToDecimal(
    data.amount0.toBigInt(),
    token0.decimals
  );
  const token1Amount = convertTokenToDecimal(
    data.amount1.toBigInt(),
    token1.decimals
  );
  const bundle = await getBundle(ctx);
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
  await ctx.store.save(mint);

  const user = (await ctx.store.get(User, mint.to))!;
  const liquiditPosition = createLiquidityPosition(pair, user);
  await createLiquiditySnapShot(ctx, pair, liquiditPosition);
  await updatePairDayData(ctx);
  await updatePairHourData(ctx);
  await updateTokenDayData(ctx, token0);
  await updateTokenDayData(ctx, token1);
}
