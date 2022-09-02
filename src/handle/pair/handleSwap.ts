import Big, { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { getBundle } from "../../store/bundle";
import { getFactory } from "../../store/factory";
import {
  getPair,
  updatePairDayData,
  updatePairHourData,
} from "../../store/pair";
import { swapAbi } from "../../utils/abi/abiUtils";
import { convertTokenToDecimal } from "../../utils/number";
import {
  MINIMUM_USD_THRESHOLD_NEW_PAIRS,
  WHITELIST,
  ZERO_BD,
} from "../../config/consts";
import { getTransaction } from "../../store/transaction";
import { Swap, Transaction } from "../../model";
import { updateAvaultDayData } from "../../store/avaultDayData";
import { updateTokenDayData } from "../../store/token";

export async function handleSwap(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address;
  const data = swapAbi.decode(ctx.event.args);
  const bundle = await getBundle(ctx);
  const pair = (await getPair(ctx, contractAddress))!;
  const factory_address = pair.factory.id;
  const factory = (await getFactory(ctx, factory_address))!;

  const { token0, token1 } = pair;
  const amount0In = convertTokenToDecimal(
    data.amount0In.toBigInt(),
    token0.decimals
  );
  const amount0Out = convertTokenToDecimal(
    data.amount0Out.toBigInt(),
    token0.decimals
  );
  const amount0Total = amount0Out.plus(amount0In);
  const amount1In = convertTokenToDecimal(
    data.amount1In.toBigInt(),
    token1.decimals
  );
  const amount1Out = convertTokenToDecimal(
    data.amount1Out.toBigInt(),
    token1.decimals
  );
  const amount1Total = amount1Out.plus(amount1In);

  const derivedAmountETH = BigDecimal(token1.derivedNative)
    .times(amount1Total)
    .plus(BigDecimal(token0.derivedNative).times(amount0Total))
    .div(2);
  const derivedAmountUSD = derivedAmountETH.times(bundle.nativePrice);

  let trackedAmountUSD = ZERO_BD;
  const price0 = BigDecimal(token0.derivedNative).times(bundle.nativePrice);
  const price1 = BigDecimal(token1.derivedNative).times(bundle.nativePrice);

  const reserve0USD = BigDecimal(pair.reserve0).times(price0);
  const reserve1USD = BigDecimal(pair.reserve1).times(price1);
  if (
    pair.liquidityProviderCount < 5 &&
    ((WHITELIST.includes(token0.id) &&
      WHITELIST.includes(token1.id) &&
      reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) ||
      (WHITELIST.includes(token0.id) &&
        !WHITELIST.includes(token1.id) &&
        reserve0USD.times(2).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) ||
      (!WHITELIST.includes(token0.id) &&
        WHITELIST.includes(token1.id) &&
        reserve1USD.times(2).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)))
  ) {
  } else {
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      trackedAmountUSD = amount0Total
        .times(price0)
        .plus(amount1Total.times(price1))
        .div(2);
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      trackedAmountUSD = amount0Total.times(price0);
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      trackedAmountUSD = amount1Total.times(price1);
    }
  }
  const trackedAmountETH = BigDecimal(bundle.nativePrice).eq(ZERO_BD)
    ? ZERO_BD
    : trackedAmountUSD.div(bundle.nativePrice);
  token0.tradeVolume = BigDecimal(token0.tradeVolume)
    .plus(amount0Total)
    .toString();
  token0.tradeVolumeUSD = BigDecimal(token0.tradeVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  token0.untrackedVolumeUSD = BigDecimal(token0.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  token0.txCount += 1;
  token1.tradeVolume = BigDecimal(token1.tradeVolume)
    .plus(amount1Total)
    .toString();
  token1.tradeVolumeUSD = BigDecimal(token1.tradeVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  token1.untrackedVolumeUSD = BigDecimal(token1.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  token1.txCount += 1;
  await ctx.store.save([token0, token1]);

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = BigDecimal(pair.volumeUSD).plus(trackedAmountUSD).toString();
  pair.volumeToken0 = BigDecimal(pair.volumeToken0)
    .plus(amount0Total)
    .toString();
  pair.volumeToken1 = BigDecimal(pair.volumeToken1)
    .plus(amount1Total)
    .toString();
  pair.untrackedVolumeUSD = BigDecimal(pair.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  pair.txCount += 1;
  await ctx.store.save(pair);

  // update global values, only used tracked amounts for volume
  factory.totalVolumeUSD = BigDecimal(factory.totalVolumeUSD)
    .plus(trackedAmountETH)
    .toString();
  factory.untrackedVolumeUSD = BigDecimal(factory.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  factory.txCount += 1;
  await ctx.store.save(factory);

  let transaction = await getTransaction(ctx, ctx.event.evmTxHash);
  if (!transaction) {
    transaction = new Transaction({
      id: ctx.event.evmTxHash,
      blockNumber: BigInt(ctx.block.height),
      timestamp: new Date(ctx.block.timestamp),
      mints: [],
      swaps: [],
      burns: [],
    });
    await ctx.store.save(transaction);
  }
  const swapId = `${transaction.id}-${transaction.swaps.length}`;
  transaction.swaps.push(swapId);
  await ctx.store.save(transaction);

  const swap = new Swap({
    id: swapId,
    transaction,
    pair,
    timestamp: new Date(ctx.block.timestamp),
    amount0In: amount0In.toString(),
    amount1In: amount1In.toString(),
    amount0Out: amount0Out.toString(),
    amount1Out: amount1Out.toString(),
    sender: data.sender.toLowerCase(),
    from: data.sender.toLowerCase(),
    to: data.to.toLowerCase(),
    logIndex: ctx.event.indexInBlock,
    amountUSD: trackedAmountUSD.eq(ZERO_BD)
      ? derivedAmountUSD.toString()
      : trackedAmountUSD.toString(),
  });
  await ctx.store.save(swap);

  const pairDayData = await updatePairDayData(ctx);
  const pairHourData = await updatePairHourData(ctx);
  const avaultDayData = await updateAvaultDayData(ctx, factory_address);
  const token0DayData = await updateTokenDayData(ctx, token0);
  const token1DayData = await updateTokenDayData(ctx, token1);

  avaultDayData.dailyVolumeUSD = BigDecimal(avaultDayData.dailyVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  avaultDayData.dailyVolumeNative = BigDecimal(avaultDayData.dailyVolumeNative)
    .plus(trackedAmountETH)
    .toString();
  avaultDayData.dailyVolumeUntracked = BigDecimal(
    avaultDayData.dailyVolumeUntracked
  )
    .plus(derivedAmountUSD)
    .toString();
  await ctx.store.save(avaultDayData);

  pairDayData.dailyVolumeToken0 = BigDecimal(pairDayData.dailyVolumeToken0)
    .plus(amount0Total)
    .toString();
  pairDayData.dailyVolumeToken1 = BigDecimal(pairDayData.dailyVolumeToken1)
    .plus(amount1Total)
    .toString();
  pairDayData.dailyVolumeUSD = BigDecimal(pairDayData.dailyVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  await ctx.store.save(pairDayData);

  pairHourData.hourlyVolumeTolen0 = BigDecimal(pairHourData.hourlyVolumeTolen0)
    .plus(amount0Total)
    .toString();
  pairHourData.hourlyVolumeTolen1 = BigDecimal(pairHourData.hourlyVolumeTolen1)
    .plus(amount1Total)
    .toString();
  pairHourData.hourlyVolumeUSD = BigDecimal(pairHourData.hourlyVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  await ctx.store.save(pairHourData);

  // swap specific updating for token0
  token0DayData.dailyVolumeToken = BigDecimal(token0DayData.dailyVolumeToken)
    .plus(amount0Total)
    .toString();
  token0DayData.dailyVolumeNative = BigDecimal(token0DayData.dailyVolumeNative)
    .plus(amount0Total.times(token0.derivedNative))
    .toString();
  token0DayData.dailyVolumeUSD = BigDecimal(token0DayData.dailyVolumeUSD)
    .plus(amount0Total.times(token0.derivedNative).times(bundle.nativePrice))
    .toString();
  await ctx.store.save(token0DayData);

  // swap specific updating
  token1DayData.dailyVolumeToken = BigDecimal(token1DayData.dailyVolumeToken)
    .plus(amount1Total)
    .toString();
  token1DayData.dailyVolumeNative = BigDecimal(token1DayData.dailyVolumeNative)
    .plus(amount1Total.times(token1.derivedNative))
    .toString();
  token1DayData.dailyVolumeUSD = BigDecimal(token1DayData.dailyVolumeUSD)
    .plus(amount1Total.times(token1.derivedNative).times(bundle.nativePrice))
    .toString();
  await ctx.store.save(token1DayData);
}
