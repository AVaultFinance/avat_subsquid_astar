import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Token } from "../../model";
import * as ERC20 from "../../abis/ERC20";

export async function getOrCreateToken(
  ctx: CommonHandlerContext<Store>,
  address: string
): Promise<Token> {
  let token = await ctx.store.get(Token, address.toLowerCase());
  if (!token) {
    const erc20 = new ERC20.Contract(ctx, address.toLowerCase());
    const name = await erc20.name();
    const symbol = await erc20.symbol();
    const decimals = await erc20.decimals();
    token = new Token({
      id: address.toLowerCase(),
      symbol,
      name,
      decimals,
    });
    await ctx.store.save(token);
  }
  return token;
}
