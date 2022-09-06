import { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Token, TokenDayData } from "../model";
import { ZERO_BD } from "../config/consts";
import { getBundle } from "./bundle";

export async function updateTokenDayData(
  ctx: EvmLogHandlerContext<Store>,
  token: Token
) {
  const bundle = await getBundle(ctx);
  const { timestamp } = ctx.block;
  const dayID = parseInt((timestamp / 86_400_000).toString());
  const dayStartTimestamp = Number(dayID) * 86_400_000;
  const tokenDayID = `${token.id}-${dayID}`;
  let tokenDayData = await ctx.store.get(TokenDayData, tokenDayID);
  if (!tokenDayData) {
    tokenDayData = new TokenDayData({
      id: tokenDayID,
      date: new Date(dayStartTimestamp),
      tokenAddress: token.id,
      priceUSD: BigDecimal(token.derivedNative)
        .times(bundle.nativePrice)
        .toString(),
      dailyVolumeToken: ZERO_BD.toString(),
      dailyVolumeNative: ZERO_BD.toString(),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyTxns: 0,
      totalLiquidityUSD: ZERO_BD.toString(),
    });
  }
  tokenDayData.priceUSD = BigDecimal(token.derivedNative)
    .times(bundle.nativePrice)
    .toString();
  tokenDayData.totalLiquidityToken = token.totalLiquidity;
  tokenDayData.totalLiquidityNative = BigDecimal(token.totalLiquidity)
    .times(token.derivedNative)
    .toString();
  tokenDayData.totalLiquidityUSD = BigDecimal(tokenDayData.totalLiquidityNative)
    .times(bundle.nativePrice)
    .toString();
  tokenDayData.dailyTxns += 1;
  await ctx.store.save(tokenDayData);
  return tokenDayData;
}
