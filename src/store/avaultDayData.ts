import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { ZERO_BD } from "../config/consts";
import { AvaultDayData, Factory } from "../model";

export async function updateAvaultDayData(
  ctx: EvmLogHandlerContext<Store>,
  factory_address: string
) {
  const factory = (await ctx.store.get(Factory, factory_address))!;
  const { timestamp } = ctx.block;
  const dayID = parseInt((timestamp / 86_400_000).toString(), 10);
  const dayStartTimestamp = Number(dayID) * 86_400_000;
  let avaultDayData = await ctx.store.get(AvaultDayData, dayID.toString());
  if (!avaultDayData) {
    avaultDayData = new AvaultDayData({
      id: dayID.toString(),
      date: new Date(dayStartTimestamp),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyVolumeNative: ZERO_BD.toString(),
      totalVolumeUSD: ZERO_BD.toString(),
      totalVolumeNative: ZERO_BD.toString(),
      dailyVolumeUntracked: ZERO_BD.toString(),
    });
  }
  avaultDayData.totalLiquidityUSD = factory.totalLiquidityUSD;
  avaultDayData.totalLiquidityNative = factory.totalLiquidityNative;
  avaultDayData.txCount = factory.txCount;
  await ctx.store.save(avaultDayData);
  return avaultDayData;
}
