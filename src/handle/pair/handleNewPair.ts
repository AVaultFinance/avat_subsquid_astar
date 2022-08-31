import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import * as factoryABI from "../../abis/factory";
import { PAIR_ADDRESSES, ZERO_BD } from "../../config/consts";
import { Pair } from "../../model";
import { DateFormat } from "../../utils/time";
import { getOrCreateToken } from "../token/getOrCreateToken";

export async function handleNewPair(ctx: EvmLogHandlerContext<Store>) {
  // const contractAddress = ctx.event.args.address.toLowerCase();
  const data = factoryABI.events[
    "PairCreated(address,address,address,uint256)"
  ].decode(ctx.event.args);
  const pairAddress = data.pair.toLowerCase();
  if (PAIR_ADDRESSES.has(pairAddress)) {
    const token0 = await getOrCreateToken(ctx, data.token0);
    const token1 = await getOrCreateToken(ctx, data.token1);
    await getOrCreateToken(ctx, pairAddress);
    const { timestamp } = ctx.block;
    // address + time(YYYY-MM-DD)
    const id = pairAddress + DateFormat(timestamp);
    const pair = new Pair({
      id,
      token0,
      token1,
      reserve0: ZERO_BD.toString(),
      reserve1: ZERO_BD.toString(),
      totalSupply: ZERO_BD.toString(),
    });
    await ctx.store.save(pair);
  }
}
