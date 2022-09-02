import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import {
  LiquidityPosition,
  LiquidityPositionSnapshot,
  Pair,
  Token,
} from "../model";
import { Big as BigDecimal } from "big.js";
import { getBundle } from "./bundle";

export async function createLiquiditySnapShot(
  ctx: CommonHandlerContext<Store>,
  pair: Pair,
  position: LiquidityPosition
): Promise<void> {
  const bundle = await getBundle(ctx);
  const { timestamp } = ctx.block;
  if (!pair || !bundle) return;
  const token0 = await ctx.store.get(Token, pair.token0.id);
  const token1 = await ctx.store.get(Token, pair.token1.id);
  if (!token0 || !token1) return;

  const snapshot = new LiquidityPositionSnapshot({
    id: `${position.id}${timestamp}`,
    liquidityPositions: position,
    timestamp: new Date(timestamp),
    block: ctx.block.height,
    user: position.user,
    pair: position.pair,
    token0PriceUSD: BigDecimal(token0.derivedNative)
      .times(BigDecimal(bundle.nativePrice))
      .toString(),
    token1PriceUSD: BigDecimal(token1.derivedNative)
      .times(BigDecimal(bundle.nativePrice))
      .toString(),
    reserve0: pair.reserve0,
    reserve1: pair.reserve1,
    reserveUSD: pair.reserveUSD,
    liquidityTokenBalance: position.liquidityTokenBalance,
    liquidityTokenTotalSupply: pair.totalSupply,
  });
  await ctx.store.save(snapshot);
}
