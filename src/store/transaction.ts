import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Transaction } from "../model";

export async function getTransaction(
  ctx: CommonHandlerContext<Store>,
  id: string
) {
  const item = await ctx.store.get(Transaction, id);
  return item;
}
