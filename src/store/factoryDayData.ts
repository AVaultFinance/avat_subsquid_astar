import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { ZERO_BD } from "../config/consts";
import { FactoryDayData, Factory } from "../model";

export async function updateFactoryDayData(
  ctx: EvmLogHandlerContext<Store>,
  factory_address: string
) {
  const factory = (await ctx.store.get(Factory, factory_address))!;
  const { timestamp } = ctx.block;
  const dayID = parseInt((timestamp / 86_400_000).toString(), 10);
  const dayStartTimestamp = Number(dayID) * 86_400_000;
  let factoryDayData = await ctx.store.get(FactoryDayData, dayID.toString());
  if (!factoryDayData) {
    factoryDayData = new FactoryDayData({
      id: dayID.toString(),
      date: new Date(dayStartTimestamp),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyVolumeNative: ZERO_BD.toString(),
      totalVolumeUSD: ZERO_BD.toString(),
      totalVolumeNative: ZERO_BD.toString(),
      dailyVolumeUntracked: ZERO_BD.toString(),
    });
  }
  factoryDayData.totalLiquidityUSD = factory.totalLiquidityUSD;
  factoryDayData.totalLiquidityNative = factory.totalLiquidityNative;
  factoryDayData.txCount = factory.txCount;
  await ctx.store.save(factoryDayData);
  return factoryDayData;
}
