import { CommonHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import assert from "assert";
import { Bundle } from "../model";
let bundle: Bundle | undefined;
export async function getBundle(
  ctx: CommonHandlerContext<Store>
): Promise<Bundle> {
  bundle = bundle || (await ctx.store.get(Bundle, "1"));
  assert(bundle != null);
  return bundle;
}
