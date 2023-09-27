"use client";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import styles from "./navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src="/android-chrome-512x512.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <a href="/">
          <p>Koinect NFT Minter</p>
        </a>
      </div>
      <ConnectKitButton />
    </nav>
  );
}
