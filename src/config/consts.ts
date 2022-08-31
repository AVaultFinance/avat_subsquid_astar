import { Big as BigDecimal } from "big.js";
export const CHAIN_NODE = "wss://rpc.astar.network";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ZERO_BI = 0n;
export const ONE_BI = 1n;
export const ZERO_BD = BigDecimal(0);
export const ONE_BD = BigDecimal(1);
export const BI_18 = 1000000000000000000n;

export const FACTORY_ADDRESSES = new Set([
  "0xc5b016c5597D298Fe9eD22922CE290A048aA5B75".toLowerCase(),
]);
export const PAIR_ADDRESSES = new Set([
  "0x7644Bf8086d40eD430D5096305830aA97Be77268".toLowerCase(),
]);
