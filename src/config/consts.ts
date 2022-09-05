import { Big as BigDecimal } from "big.js";
export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ZERO_BI = 0n;
export const ONE_BI = 1n;
export const ZERO_BD = BigDecimal(0);
export const ONE_BD = BigDecimal(1);
export const BI_18 = 1000000000000000000n;

export const FACTORY_ADDRESSES = new Set([
  "0xA9473608514457b4bF083f9045fA63ae5810A03E".toLowerCase(),
]);
export const PAIR_ADDRESSES = new Set([
  "0x49d1DB92A8a1511A6eeb867221d801bC974A3073".toLowerCase(),
  "0x7644Bf8086d40eD430D5096305830aA97Be77268".toLowerCase(),
  "0x996D73aC8F97cf15BD476b77CB92ce47cA0E71Fe".toLowerCase(),
  "0xeee106Aa8a0DE519E8Eb21C66A5c2275b46b3F4d".toLowerCase(),
]);

export const WHITELIST: string[] = [
  "0xaeaaf0e2c81af264101b9129c00f4440ccf0f720".toLowerCase(), // wnative
  "0x6a2d262d56735dba19dd70682b39f6be9a931d98".toLowerCase(), // usdc
];
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = new BigDecimal(3000);
export const WNATIVE =
  "0xaeaaf0e2c81af264101b9129c00f4440ccf0f720".toLowerCase();
// arthswap USDC-WASTR LP
export const NATIVE_USDC =
  "0x806f746a7c4293092ac7aa604347BE123322dF1e".toLowerCase();
export const USDC = "0x6a2d262d56735dba19dd70682b39f6be9a931d98".toLowerCase();
