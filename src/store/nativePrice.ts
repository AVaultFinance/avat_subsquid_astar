import { Big as BigDecimal } from "big.js";
import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { getPair } from "./pair";
import {
  MINIMUM_USD_THRESHOLD_NEW_PAIRS,
  NATIVE_USDC,
  ONE_BD,
  USDC,
  WHITELIST,
  WNATIVE,
  ZERO_BD,
} from "../config/consts";
import { Pair } from "../model";
import { getOrCreateToken } from "../handle/token/getOrCreateToken";

export async function getNativePriceInUSD(
  ctx: CommonHandlerContext<Store>
): Promise<BigDecimal> {
  const nativeUsdcPair = await getPair(ctx, NATIVE_USDC);
  if (!nativeUsdcPair) return BigDecimal(0);

  return nativeUsdcPair.token0Address === USDC
    ? BigDecimal(nativeUsdcPair.token0Price)
    : BigDecimal(nativeUsdcPair.token1Price);
}

export async function findNativePerToken(
  ctx: CommonHandlerContext<Store>,
  tokenId: string
): Promise<BigDecimal> {
  if (tokenId === WNATIVE) {
    return ONE_BD;
  }
  const whiteListPairs = await ctx.store.find(Pair, {
    where: WHITELIST.map((address) => [
      { token0Address: address, token1Address: tokenId },
      { token1Address: address, token0Address: tokenId },
    ]).flat(),
  });
  for (const pair of whiteListPairs) {
    if (BigDecimal(pair.reserveNative).gt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
      if (pair.token0Address === tokenId) {
        const token1 = await getOrCreateToken(ctx, pair.token1Address);
        // token0 = token1Price  return token1 per our token * Native per token 1
        return BigDecimal(pair.token1Price).mul(token1.derivedNative);
      }
      if (pair.token1Address === tokenId) {
        const token0 = await getOrCreateToken(ctx, pair.token1Address);
        return BigDecimal(pair.token0Price).mul(token0.derivedNative);
      }
    }
  }
  return ZERO_BD;
}
