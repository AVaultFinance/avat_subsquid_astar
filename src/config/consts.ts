import { Big as BigDecimal } from "big.js";
export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ZERO_BI = 0n;
export const ONE_BI = 1n;
export const ZERO_BD = BigDecimal(0);
export const ONE_BD = BigDecimal(1);
export const BI_18 = 1000000000000000000n;
export const FACTORY_ADDRESS = "0xA9473608514457b4bF083f9045fA63ae5810A03E";
export const FACTORY_ADDRESSES = new Set([
  "0xA9473608514457b4bF083f9045fA63ae5810A03E".toLowerCase(),
]);
export const PAIR_ADDRESSES = new Set([
  // symbol: 'BAI-USDC LP',
  "0x7644Bf8086d40eD430D5096305830aA97Be77268".toLowerCase(),
  // symbol: 'DAI-USDC LP',
  "0x996D73aC8F97cf15BD476b77CB92ce47cA0E71Fe".toLowerCase(),
  // symbol: 'BUSD-USDC LP',
  "0xeee106Aa8a0DE519E8Eb21C66A5c2275b46b3F4d".toLowerCase(),
  // symbol: 'USDT-USDC LP',
  "0xD72A602C714ae36D990dc835eA5F96Ef87657D5e".toLowerCase(),
  // symbol: 'ARSW-USDC LP',
  "0xBD13Fd873d36f7D2A349b35E6854E3183ede18ab".toLowerCase(),
  // symbol: 'ARSW-USDT LP',
  "0x7843ecd6F3234D72D0b7034DD9894b77c416c6EF".toLowerCase(),
  // symbol: 'ARSW-BAI LP',
  "0x8897D79334c2D517b83E7846da4B922E68fdA61B".toLowerCase(),
  // symbol: 'ACA-ASTR LP',
  "0x49d1DB92A8a1511A6eeb867221d801bC974A3073".toLowerCase(),
  // symbol: 'USDT-WASTR LP',
  "0x806f746a7c4293092ac7aa604347BE123322dF1e".toLowerCase(),
  // symbol: 'USDC-WASTR LP',
  "0xBB1290c1829007F440C771b37718FAbf309cd527".toLowerCase(),
  // symbol: 'WETH-WASTR LP',
  "0x87988EbDE7E661F44eB3a586C5E0cEAB533a2d9C".toLowerCase(),
  // symbol: 'DAI-USDC LP',
  "0x996D73aC8F97cf15BD476b77CB92ce47cA0E71Fe".toLowerCase(),
  // symbol: 'ARSW-WASTR LP',
  "0x50497E7181eB9e8CcD70a9c44FB997742149482a".toLowerCase(),
  // symbol: 'DOT-USDC LP',
  "0xF4119c3d9e65602bb34f2455644e45c98d29bB4b".toLowerCase(),
  // symbol: 'DOT-WASTR LP',
  "0x40E938688a121370092A06745704c112C5ee5791".toLowerCase(),
  // symbol: 'MUUU-WASTR LP',
  "0xb60a1827Db219729f837f2D0982B4CDb5a9bA4b1".toLowerCase(),
  // symbol: 'KGL-WASTR LP',
  "0xaa1fa6A811D82Fa4383b522b4aF4De3a5041063E".toLowerCase(),
  // symbol: 'LAY-WASTR LP',
  "0x78D5C2Adeb11BE00033Cc4EDB2C2889CF945415E".toLowerCase(),
  // symbol: 'OUSD-USDC LP',
  "0xCf83a3d83c1265780d9374e8a7c838fE22BD3DC6".toLowerCase(),
  // symbol: 'BAI-USDC LP',
  "0x7644Bf8086d40eD430D5096305830aA97Be77268".toLowerCase(),
  // symbol: 'BAI-WASTR LP',
  "0x3d78a6CCA5c717C0e8702896892f3522D0b07010".toLowerCase(),
  // symbol: 'NIKA-WASTR LP',
  "0xeF8B14e08c292cc552494ec428A75c8A3cd417B6".toLowerCase(),
  // symbol: 'ORU-WASTR LP',
  "0xaC4b7043DA7152726D54B0fB1628a2FFF73f874e".toLowerCase(),
  // symbol: 'JPYC-WASTR LP',
  "0xF041a8e6e27341F5f865a22f01Fa37e065c32156".toLowerCase(),
  // symbol: 'WSDN-WASTR LP',
  "0xCcEFDDfF4808F3e1e0340e19e43f1E9Fd088b3F2".toLowerCase(),
  // symbol: 'MATIC-WASTR LP',
  "0xCA59df939290421047876C917789afdB68D5D6f1".toLowerCase(),
  // symbol: 'BNB-WASTR LP',
  "0x92127ec0EbEF8B30378D757bbE8dCE18210B848B".toLowerCase(),
  // symbol: 'WBTC-WASTR LP',
  "0x61a49Ba86E168cD25cA795b07B0A93236BB25127".toLowerCase(),
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

// symbol: 'ASTR',
// wantAddress: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720'.toLowerCase(),
// symbol: 'USDC',
// wantAddress: '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98'.toLowerCase(),
// symbol: 'USDT',
// wantAddress: '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283'.toLowerCase(),
// symbol: 'BTC',
// wantAddress: '0xad543f18cFf85c77E140E3E5E3c3392f6Ba9d5CA'.toLowerCase(),
// symbol: 'ETH',
// wantAddress: '0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c'.toLowerCase(),
// symbol: 'SDN',
// wantAddress: '0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4'.toLowerCase(),
// symbol: 'DAI',
// wantAddress: '0x6De33698e9e9b787e09d3Bd7771ef63557E148bb'.toLowerCase(),
// symbol: 'BUSD',
// wantAddress: '0x4Bf769b05E832FCdc9053fFFBC78Ca889aCb5E1E'.toLowerCase(),
// symbol: 'MATIC',
// wantAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF'.toLowerCase(),
// symbol: 'BNB',
// wantAddress: '0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52'.toLowerCase(),
// symbol: 'DOT',
// wantAddress: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'.toLowerCase(),
// symbol: 'BAI-USDC LP',
// wantAddress: '0x7644Bf8086d40eD430D5096305830aA97Be77268'.toLowerCase(),
// symbol: 'DAI-USDC LP',
// wantAddress: '0x996D73aC8F97cf15BD476b77CB92ce47cA0E71Fe'.toLowerCase(),
// symbol: 'BUSD-USDC LP',
// wantAddress: '0xeee106Aa8a0DE519E8Eb21C66A5c2275b46b3F4d'.toLowerCase(),
// symbol: 'USDT-USDC LP',
// wantAddress: '0xD72A602C714ae36D990dc835eA5F96Ef87657D5e'.toLowerCase(),
// symbol: 'ARSW-USDC LP',
// wantAddress: '0xBD13Fd873d36f7D2A349b35E6854E3183ede18ab'.toLowerCase(),
// symbol: 'ARSW-USDT LP',
// wantAddress: '0x7843ecd6F3234D72D0b7034DD9894b77c416c6EF'.toLowerCase(),
// symbol: 'ARSW-BAI LP',
// wantAddress: '0x8897D79334c2D517b83E7846da4B922E68fdA61B'.toLowerCase(),
// symbol: 'ACA-ASTR LP',
// wantAddress: '0x49d1DB92A8a1511A6eeb867221d801bC974A3073'.toLowerCase(),
// symbol: 'USDT-WASTR LP',
// wantAddress: '0x806f746a7c4293092ac7aa604347BE123322dF1e'.toLowerCase(),
// symbol: 'USDC-WASTR LP',
// wantAddress: '0xBB1290c1829007F440C771b37718FAbf309cd527'.toLowerCase(),
// symbol: 'WETH-WASTR LP',
// wantAddress: '0x87988EbDE7E661F44eB3a586C5E0cEAB533a2d9C'.toLowerCase(),
// symbol: 'DAI-USDC LP',
// wantAddress: '0x996D73aC8F97cf15BD476b77CB92ce47cA0E71Fe'.toLowerCase(),
// symbol: 'ARSW-WASTR LP',
// wantAddress: '0x50497E7181eB9e8CcD70a9c44FB997742149482a'.toLowerCase(),
// symbol: 'DOT-USDC LP',
// wantAddress: '0xF4119c3d9e65602bb34f2455644e45c98d29bB4b'.toLowerCase(),
// symbol: 'DOT-WASTR LP',
// wantAddress: '0x40E938688a121370092A06745704c112C5ee5791'.toLowerCase(),
// symbol: 'MUUU-WASTR LP',
// wantAddress: '0xb60a1827Db219729f837f2D0982B4CDb5a9bA4b1'.toLowerCase(),
// symbol: 'KGL-WASTR LP',
// wantAddress: '0xaa1fa6A811D82Fa4383b522b4aF4De3a5041063E'.toLowerCase(),
// symbol: 'LAY-WASTR LP',
// wantAddress: '0x78D5C2Adeb11BE00033Cc4EDB2C2889CF945415E'.toLowerCase(),
// symbol: 'OUSD-USDC LP',
// wantAddress: '0xCf83a3d83c1265780d9374e8a7c838fE22BD3DC6'.toLowerCase(),
// symbol: 'BAI-USDC LP',
// wantAddress: '0x7644Bf8086d40eD430D5096305830aA97Be77268'.toLowerCase(),
// symbol: 'BAI-WASTR LP',
// wantAddress: '0x3d78a6CCA5c717C0e8702896892f3522D0b07010'.toLowerCase(),
// symbol: 'NIKA-WASTR LP',
// wantAddress: '0xeF8B14e08c292cc552494ec428A75c8A3cd417B6'.toLowerCase(),
// symbol: 'ORU-WASTR LP',
// wantAddress: '0xaC4b7043DA7152726D54B0fB1628a2FFF73f874e'.toLowerCase(),
// symbol: 'JPYC-WASTR LP',
// wantAddress: '0xF041a8e6e27341F5f865a22f01Fa37e065c32156'.toLowerCase(),
// symbol: 'WSDN-WASTR LP',
// wantAddress: '0xCcEFDDfF4808F3e1e0340e19e43f1E9Fd088b3F2'.toLowerCase(),
// symbol: 'MATIC-WASTR LP',
// wantAddress: '0xCA59df939290421047876C917789afdB68D5D6f1'.toLowerCase(),
// symbol: 'BNB-WASTR LP',
// wantAddress: '0x92127ec0EbEF8B30378D757bbE8dCE18210B848B'.toLowerCase(),
// symbol: 'WBTC-WASTR LP',
// wantAddress: '0x61a49Ba86E168cD25cA795b07B0A93236BB25127'.toLowerCase(),

// "pairs": [
//   {
//     "id": "0x50497e7181eb9e8ccd70a9c44fb997742149482a",
//     "txCount": 0
//   },
//   {
//     "id": "0xba912abfb0d1599eee87e5926d05edb01142baf3",
//     "txCount": 0
//   },
//   {
//     "id": "0xbd13fd873d36f7d2a349b35e6854e3183ede18ab",
//     "txCount": 0
//   },
//   {
//     "id": "0xa7de92a140e0353bfe98cec639d6e41387a6a14f",
//     "txCount": 0
//   },
//   {
//     "id": "0x7843ecd6f3234d72d0b7034dd9894b77c416c6ef",
//     "txCount": 0
//   },
//   {
//     "id": "0xdc0b29cb77c225a2a7767f20d49721858fa9822f",
//     "txCount": 0
//   },
//   {
//     "id": "0xdd44213793eb90f868cbc9f41fa3129d446fd466",
//     "txCount": 0
//   },
//   {
//     "id": "0x00580d346870d5249b774e3d8761f5358a126969",
//     "txCount": 0
//   },
//   {
//     "id": "0xb571d2bf06a16d0905a67cb3ac34e282fe6cbc71",
//     "txCount": 0
//   },
//   {
//     "id": "0x0e9a14120520178400c63e65bc4498768e8be047",
//     "txCount": 0
//   },
//   {
//     "id": "0x18a4185f2b708d39c01bc4c8a614ff12d2d0d3f7",
//     "txCount": 0
//   },
//   {
//     "id": "0x34b0aa92bdb305a6e747b9f36c4e039be67d41db",
//     "txCount": 0
//   },
//   {
//     "id": "0x8897d79334c2d517b83e7846da4b922e68fda61b",
//     "txCount": 0
//   }
// ]
