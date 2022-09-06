import {
  CommonHandlerContext,
  EvmLogHandlerContext,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import Big from "big.js";
import { ZERO_BD } from "../config/consts";
import { Pair, PairDayData, PairHourData } from "../model";

export async function getPair(
  ctx: CommonHandlerContext<Store>,
  address: string
) {
  const item = await ctx.store.get(Pair, {
    where: { id: address },
    // relations: { token0Address: true, token1Address: true },
  });
  return item;
}

export async function updatePairDayData(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();
  const { timestamp } = ctx.block;
  const dayID = parseInt((timestamp / 86_400_000).toString(), 10);
  const dayStartTimestamp = Number(dayID) * 86_400_000;
  const dayPairID = `${contractAddress as string}-${dayID}`;
  const pair = (await ctx.store.find(Pair, contractAddress))[0]!;
  let pairDayData = await ctx.store.get(PairDayData, dayPairID);
  if (!pairDayData) {
    pairDayData = new PairDayData({
      id: dayPairID,
      date: new Date(dayStartTimestamp),
      token0Address: pair.token0Address,
      token1Address: pair.token1Address,
      pairAddress: contractAddress,
      dailyVolumeToken0: ZERO_BD.toString(),
      dailyVolumeToken1: ZERO_BD.toString(),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyTxns: 0,
    });
  }
  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.reserve0 = pair.reserve0;
  pairDayData.reserve1 = pair.reserve1;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.dailyTxns += 1;
  await ctx.store.save(pairDayData);
  return pairDayData;
}
export async function updatePairHourData(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();
  const { timestamp } = ctx.block;
  const hourID = parseInt((timestamp / 3_600_000).toString(), 10);
  const hourStartTimestamp = Number(hourID) * 3_600_000;
  const dayPairID = `${contractAddress as string}-${hourID}`;
  const pair = (await ctx.store.get(Pair, contractAddress))!;
  let pairHourData = await ctx.store.get(PairHourData, dayPairID);
  if (!pairHourData) {
    pairHourData = new PairHourData({
      id: dayPairID,
      hourStartUnix: BigInt(hourStartTimestamp),
      pairAddress: contractAddress,
      hourlyVolumeToken0: ZERO_BD.toString(),
      hourlyVolumeToken1: ZERO_BD.toString(),
      hourlyVolumeUSD: ZERO_BD.toString(),
      hourlyTxns: 0,
    });
  }
  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.reserve0 = pair.reserve0;
  pairHourData.reserve1 = pair.reserve1;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.hourlyTxns += 1;
  await ctx.store.save(pairHourData);
  return pairHourData;
}
