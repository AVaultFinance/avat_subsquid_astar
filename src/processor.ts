import { lookupArchive } from "@subsquid/archive-registry";
import {
  EvmLogHandlerContext,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  CHAIN_NODE,
  FACTORY_ADDRESS,
  FACTORY_ADDRESSES,
  PAIR_ADDRESSES,
} from "./config/consts";
import * as factoryABI from "./abis/factory";
import * as pair from "./abis/pair";
import { handleNewPair } from "./handle/pair/handleNewPair";
import { Pair, Token } from "./model";
import { handleTransfer } from "./handle/pair/handleTransfer";
import { handleSync } from "./handle/pair/handleSync";
import { handleSwap } from "./handle/pair/handleSwap";
import { handleMint } from "./handle/pair/handleMint";
import { handleBurn } from "./handle/pair/handleBurn";

const database = new TypeormDatabase();
const processor = new SubstrateBatchProcessor()
  .setBatchSize(100)
  .setBlockRange({ from: 1326430 })
  .setDataSource({
    chain: CHAIN_NODE,
    archive: lookupArchive("astar", { release: "FireSquid" }),
  })
  .addEvmLog(FACTORY_ADDRESS, {
    filter: [
      factoryABI.events["PairCreated(address,address,address,uint256)"].topic,
    ],
  })
  .addEvmLog("*", {
    filter: [
      [
        pair.events["Transfer(address,address,uint256)"].topic,
        pair.events["Sync(uint112,uint112)"].topic,
        pair.events["Swap(address,uint256,uint256,uint256,uint256,address)"]
          .topic,
        pair.events["Mint(address,uint256,uint256)"].topic,
        pair.events["Burn(address,uint256,uint256,address)"].topic,
      ],
    ],
  });

processor.run(database, async (ctx) => {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === "event") {
        if (item.name === "EVM.Log") {
          await handleEvmLog({
            ...ctx,
            block: block.header,
            event: item.event,
          });
        }
      }
    }
  }
});

const knownPairContracts: Set<string> = new Set();
async function isKnownPairContracts(store: Store, address: string) {
  if (knownPairContracts.has(address)) {
    return true;
  }
  if (await tryIsPairInvolved(store, address)) {
    knownPairContracts.add(address);
    return true;
  }
  return false;
}
async function tryIsPairInvolved(store: Store, address: string) {
  try {
    return (await store.countBy(Pair, { id: address })) > 0;
  } catch {
    return false;
  }
}
async function handleEvmLog(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address.toLowerCase();
  if (FACTORY_ADDRESSES.has(contractAddress)) {
    ctx.log.info("FACTORY_ADDRESSES--: " + contractAddress);
    await handleNewPair(ctx);
  } else if (PAIR_ADDRESSES.has(contractAddress)) {
    if (await isKnownPairContracts(ctx.store, contractAddress)) {
      ctx.log.info("PAIR_ADDRESSES--: " + contractAddress);
      switch (ctx.event.args.topics[0]) {
        case pair.events["Transfer(address,address,uint256)"].topic:
          await handleTransfer(ctx);
          break;
        case pair.events["Sync(uint112,uint112)"].topic:
          await handleSync(ctx);
          break;
        case pair.events[
          "Swap(address,uint256,uint256,uint256,uint256,address)"
        ].topic:
          await handleSwap(ctx);
          break;
        case pair.events["Mint(address,uint256,uint256)"].topic:
          await handleMint(ctx);
          break;
        case pair.events["Burn(address,uint256,uint256,address)"].topic:
          await handleBurn(ctx);
          break;
        default:
          break;
      }
    }
  }
}
