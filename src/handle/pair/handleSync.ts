import Big, { Big as BigDecimal } from "big.js";
import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { getBundle } from "../../store/bundle";
import { getFactory } from "../../store/factory";
import { getPair } from "../../store/pair";
import { syncEventAbi } from "../../utils/abi/abiUtils";
import { convertTokenToDecimal } from "../../utils/number";
import { WHITELIST, ZERO_BD } from "../../config/consts";
import {
  findNativePerToken,
  getNativePriceInUSD,
} from "../../store/nativePrice";

export async function handleSync(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();

  const data = syncEventAbi.decode(ctx.event.args);

  const bundle = await getBundle(ctx);

  const pair = await getPair(ctx, contractAddress);
  if (!pair) return;
  const factory_address = pair.factory.id;
  const factory = await getFactory(ctx, factory_address)!;
  if (!factory) return;

  const { token0, token1 } = pair;
  factory.totalLiquidityNative = BigDecimal(factory.totalLiquidityNative)
    .minus(pair.trackedReserveNative)
    .toString();
  token0.totalLiquidity = BigDecimal(token0.totalLiquidity)
    .minus(pair.reserve0)
    .toString();
  token1.totalLiquidity = BigDecimal(token1.totalLiquidity)
    .minus(pair.reserve1)
    .toString();

  pair.reserve0 = convertTokenToDecimal(
    data.reserve0.toBigInt(),
    token0.decimals
  ).toString();

  pair.reserve1 = convertTokenToDecimal(
    data.reserve1.toBigInt(),
    token1.decimals
  ).toString();

  pair.token0Price = !BigDecimal(pair.reserve1).eq(ZERO_BD)
    ? BigDecimal(pair.reserve0).div(pair.reserve1).toString()
    : ZERO_BD.toString();
  pair.token1Price = !BigDecimal(pair.reserve0).eq(ZERO_BD)
    ? BigDecimal(pair.reserve1).div(pair.reserve0).toString()
    : ZERO_BD.toString();
  await ctx.store.save(pair);

  bundle.nativePrice = (await getNativePriceInUSD(ctx)).toString();
  await ctx.store.save(bundle);

  token0.derivedNative = (await findNativePerToken(ctx, token0.id)).toString();
  token1.derivedNative = (await findNativePerToken(ctx, token1.id)).toString();

  let trackedLiquidityNative = ZERO_BD;
  if (!BigDecimal(bundle.nativePrice).eq(ZERO_BD)) {
    const price0USD = BigDecimal(token0.derivedNative).times(
      bundle.nativePrice
    );
    const price1USD = BigDecimal(token1.derivedNative).times(
      bundle.nativePrice
    );
    let trackedLiquidityUSD = ZERO_BD;
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      trackedLiquidityUSD = BigDecimal(pair.reserve0)
        .times(price0USD)
        .plus(BigDecimal(pair.reserve1).times(price1USD));
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      trackedLiquidityUSD = BigDecimal(pair.reserve0).times(price0USD).times(2);
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      trackedLiquidityUSD = BigDecimal(pair.reserve1).times(price1USD).times(2);
    }
    trackedLiquidityNative = trackedLiquidityUSD.div(bundle.nativePrice);
  }
  pair.trackedReserveNative = trackedLiquidityNative.toString();
  pair.reserveNative = BigDecimal(pair.reserve0)
    .times(token0.derivedNative)
    .plus(BigDecimal(pair.reserve1).times(token1.derivedNative))
    .toString();
  pair.reserveUSD = BigDecimal(pair.reserveNative)
    .times(bundle.nativePrice)
    .toString();
  await ctx.store.save(pair);

  factory.totalLiquidityNative = BigDecimal(factory.totalLiquidityNative)
    .plus(trackedLiquidityNative)
    .toString();
  factory.totalLiquidityUSD = BigDecimal(factory.totalLiquidityNative)
    .times(bundle.nativePrice)
    .toString();
  await ctx.store.save(factory);

  token0.totalLiquidity = BigDecimal(token0.totalLiquidity)
    .plus(pair.reserve0)
    .toString();
  token1.totalLiquidity = BigDecimal(token1.totalLiquidity)
    .plus(pair.reserve1)
    .toString();
  await ctx.store.save([token0, token1]);
}
