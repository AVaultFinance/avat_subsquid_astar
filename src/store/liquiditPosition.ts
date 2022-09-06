import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { ZERO_BD } from "../config/consts";
import { LiquidityPosition, Pair, User } from "../model";

interface LiquidityPositionData {
  pair: Pair;
  user: User;
}
export async function getLiquiditPosition(
  ctx: CommonHandlerContext<Store>,
  id: string
) {
  const item = await ctx.store.get(LiquidityPosition, id);
  return item;
}
export function createLiquidityPosition(pair: Pair, user: User) {
  return new LiquidityPosition({
    id: `${pair.id}-${user.id}`,
    liquidityTokenBalance: ZERO_BD.toString(),
    pair,
    user,
  });
}
export async function updateLiquidityPosition(
  ctx: CommonHandlerContext<Store>,
  pair: Pair,
  user: User
): Promise<LiquidityPosition> {
  let position = await getLiquiditPosition(ctx, `${pair.id}-${user.id}`);
  if (!position) {
    position = createLiquidityPosition(pair, user);
  }
  pair.liquidityProviderCount += 1;
  position.pair = pair;
  position.user = user;
  await ctx.store.save(position);
  return position;
}
