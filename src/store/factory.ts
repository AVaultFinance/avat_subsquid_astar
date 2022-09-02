import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { assert } from "console";
import { Factory } from "../model";
let factory: Factory | undefined;
export async function getFactory(
  ctx: CommonHandlerContext<Store>,
  address: string
) {
  factory = factory || (await ctx.store.get(Factory, address.toLowerCase()));
  assert(factory != null);
  return factory;
}
