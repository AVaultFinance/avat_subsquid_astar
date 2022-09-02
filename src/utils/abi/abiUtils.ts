import * as pairABI from "../../abis/pair";

export const transferEventAbi =
  pairABI.events["Transfer(address,address,uint256)"];
export const syncEventAbi = pairABI.events["Sync(uint112,uint112)"];
export const swapAbi =
  pairABI.events["Swap(address,uint256,uint256,uint256,uint256,address)"];
export const mintAbi = pairABI.events["Mint(address,uint256,uint256)"];
export const burnAbi = pairABI.events["Burn(address,uint256,uint256,address)"];
