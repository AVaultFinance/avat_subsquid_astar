import { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Burn, Transaction, User } from "../../model";
import { getFactory } from "../../store/factory";
import {
  getPair,
  updatePairDayData,
  updatePairHourData,
} from "../../store/pair";
import { burnAbi } from "../../utils/abi/abiUtils";
import { convertTokenToDecimal } from "../../utils/number";
import { ZERO_BD } from "../../config/consts";
import {
  createLiquidityPosition,
  updateLiquidityPosition,
} from "../../store/liquiditPosition";
import { createLiquiditySnapShot } from "../../store/liquiditySnapShot";
import { updateTokenDayData } from "../../store/token";
import { updateFactoryDayData } from "../../store/factoryDayData";
import { getBundle } from "../../store/bundle";

export async function handleBurn(ctx: EvmLogHandlerContext<Store>) {
  const transaction = await ctx.store.get(Transaction, ctx.event.evmTxHash);
  if (!transaction) return;
  const { burns } = transaction;
  const burn = (await ctx.store.get(Burn, burns[burns.length - 1]))!;
  const contractAddress = ctx.event.args.address.toLowerCase();
  const data = burnAbi.decode(ctx.event.args);
  const pair = (await getPair(ctx, contractAddress))!;
  if (!pair) {
    return;
  }
  ctx.log.error(` burn.pair.factory.id---: ${pair.factoryAddress}`);
  const factory_address = pair.factoryAddress;
  if (!factory_address) return;
  const factory = (await getFactory(ctx, factory_address))!;

  pair.txCount += 1;
  factory.txCount += 1;

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
  let user = await ctx.store.get(User, data.sender);
  if (!user) {
    user = new User({
      id: data.sender,
      liquidityPositions: [],
      usdSwapped: ZERO_BD.toString(),
    });
    await ctx.store.save(user);
  }
  await updateLiquidityPosition(ctx, pair, user);
  await ctx.store.save(factory);
  await ctx.store.save(pair);
  await ctx.store.save([token0, token1]);

  burn.sender = data.sender;
  burn.to = data.to;
  burn.amount0 = token0Amount.toString();
  burn.amount1 = token1Amount.toString();
  burn.logIndex = ctx.event.indexInBlock;
  burn.amountUSD = amountTotalUSD.toString();
  await ctx.store.save(burn);

  const liquiditPosition = createLiquidityPosition(pair, user);
  await createLiquiditySnapShot(ctx, pair, liquiditPosition);

  await updatePairDayData(ctx);
  await updatePairHourData(ctx);
  await updateTokenDayData(ctx, token0);
  await updateTokenDayData(ctx, token1);
  await updateFactoryDayData(ctx, factory_address);
}
