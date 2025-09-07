import { defineChain } from "thirdweb/chains";

// Somnia Shannon Testnet
export const somniaShannon = defineChain({
  id: 50312,
  name: "Somnia Shannon Testnet",
  nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
  rpc: "https://50312.rpc.thirdweb.com",
  blockExplorers: [{ name: "Shannon Explorer", url: "https://shannon-explorer.somnia.network" }],
  testnet: true,
});
