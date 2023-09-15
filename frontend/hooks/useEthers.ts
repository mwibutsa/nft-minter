import { Alchemy, Network, Wallet } from "alchemy-sdk";

export const provider = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: process.env.NEXT_PUBLIC_DEFAULT_CHAIN as Network,
});

export const useSigner = () => {
  return new Wallet(String(process.env.NEXT_PUBLIC_PRIVATE_KEY), provider);
};
