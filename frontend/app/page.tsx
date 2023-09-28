"use client";
import styles from "./page.module.css";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import NftCreator from "@/components/NFTCreator";
import KOINECTMarketplace from "@/artifacts/contracts/KOINECTMarketplace.sol/KOINECTMarketplace.json";

export default function Home() {
  return (
    <main className={styles.main}>
      <NftCreator
        contractAddress={String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)}
        abi={KOINECTMarketplace.abi}
      />
    </main>
  );
}
