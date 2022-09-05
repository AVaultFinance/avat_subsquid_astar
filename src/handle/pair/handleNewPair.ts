import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import * as factoryABI from "../../abis/factory";
import {
  FACTORY_ADDRESSES,
  PAIR_ADDRESSES,
  ZERO_BD,
} from "../../config/consts";
import { Bundle, Factory, Pair } from "../../model";
import { getOrCreateToken } from "../token/getOrCreateToken";

export async function handleNewPair(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();

  if (FACTORY_ADDRESSES.has(contractAddress)) {
    const data = factoryABI.events[
      "PairCreated(address,address,address,uint256)"
    ].decode(ctx.event.args);

    let factory = await ctx.store.get(Factory, contractAddress);
    if (!factory) {
      factory = new Factory({
        id: contractAddress,
        pairCount: 0,
        totalVolumeNative: ZERO_BD.toString(),
        totalVolumeUSD: ZERO_BD.toString(),
        totalLiquidityNative: ZERO_BD.toString(),
        totalLiquidityUSD: ZERO_BD.toString(),
        untrackedVolumeUSD: ZERO_BD.toString(),
        txCount: 0,
      });
      const bundle = new Bundle({
        id: "1",
        nativePrice: ZERO_BD.toString(),
      });
      await ctx.store.save(bundle);
    }
    factory.pairCount += 1;
    await ctx.store.save(factory);

    const pairAddress = data.pair.toLowerCase();
    ctx.log.trace(`FACTORY_ADDRESSES: ${FACTORY_ADDRESSES}`);
    if (PAIR_ADDRESSES.has(pairAddress)) {
      ctx.log.trace(`PAIR_ADDRESSES: ${FACTORY_ADDRESSES}`);
      const token0 = await getOrCreateToken(ctx, data.token0);
      const token1 = await getOrCreateToken(ctx, data.token1);
      await getOrCreateToken(ctx, pairAddress);

      // address + time(YYYY-MM-DD)
      const pair = new Pair({
        id: pairAddress,
        factory,
        token0,
        token1,
        liquidityProviderCount: 0,
        createdAtTimestamp: new Date(ctx.block.timestamp),
        createdAtBlockNumber: BigInt(ctx.block.height),
        txCount: 0,
        reserve0: ZERO_BD.toString(),
        reserve1: ZERO_BD.toString(),
        trackedReserveNative: ZERO_BD.toString(),
        reserveNative: ZERO_BD.toString(),
        reserveUSD: ZERO_BD.toString(),
        totalSupply: ZERO_BD.toString(),
        volumeToken0: ZERO_BD.toString(),
        volumeToken1: ZERO_BD.toString(),
        volumeUSD: ZERO_BD.toString(),
        untrackedVolumeUSD: ZERO_BD.toString(),
        token0Price: ZERO_BD.toString(),
        token1Price: ZERO_BD.toString(),
      });
      await ctx.store.save(pair);
    }
  }
}
