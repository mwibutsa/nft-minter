import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: String(process.env.NEXT_PUBLIC_DEFAULT_CHAIN) as Network,
});

export default alchemy;
