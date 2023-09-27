"use client";
import styles from "./page.module.css";
import "./globals.css";
import NftCreator from "@/components/NFTCreator";
import MultiTokens from "@/artifacts/contracts/KOINECTMarketplace.sol/KOINECTMarketplace.json";

export default function Home() {
  return (
    <main className={styles.main}>
      <NftCreator
        contractAddress={String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)}
        abi={MultiTokens.abi}
      />
    </main>
  );
}
