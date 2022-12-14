import { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import Big from "big.js";
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
    if (PAIR_ADDRESSES.has(pairAddress)) {
      const token0 = await getOrCreateToken(ctx, data.token0);
      const token1 = await getOrCreateToken(ctx, data.token1);
      await getOrCreateToken(ctx, pairAddress);
      const pair = new Pair({
        id: pairAddress,
        factoryAddress: factory.id,
        token0Address: token0.id,
        token1Address: token1.id,
        liquidityProviderCount: 0,
        createdAtTimestamp: new Date(ctx.block.timestamp),
        createdAtBlockNumber: BigDecimal(ctx.block.height).toString(),
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
