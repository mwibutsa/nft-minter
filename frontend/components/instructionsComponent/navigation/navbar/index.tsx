"use client";
import { ConnectKitButton } from "connectkit";
import styles from "./navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="/">
        <p>NFT CREATOR</p>
      </a>
      <ConnectKitButton />
    </nav>
  );
}
