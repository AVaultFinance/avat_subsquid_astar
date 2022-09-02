import { Big as BigDecimal } from "big.js";
export function convertTokenToDecimal(
  amount: BigInt,
  decimals: number
): BigDecimal {
  return BigDecimal(amount.toString()).div((10 ** decimals).toString());
}
