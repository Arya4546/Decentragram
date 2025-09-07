"use client";

import Feed from "@/components/decentragram/Feed";
import Link from "next/link";
import styles from "./styles.module.css";

export default function DecentragramPage() {
  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Decentragram</h1>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navlink}>Claim</Link>
          <Link href="/decentragram" className={`${styles.navlink} ${styles.active}`}>Feed</Link>
        </nav>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <span className={styles.chip}>All</span>
          <span className={styles.chip}>Following</span>
          <span className={styles.chip}>Trending</span>
          <span className={styles.chip}>Fresh</span>
        </div>
        <div className={styles.stats}>
          <span>IPFS Gateway: Pinata</span>
          <span>Mode: On-chain + IPFS</span>
        </div>
      </div>

      <Feed />

      <footer className={styles.footer}>
        Built for Somnia Shannon Testnet · Images stored via Pinata/IPFS
      </footer>
    </main>
  );
}
