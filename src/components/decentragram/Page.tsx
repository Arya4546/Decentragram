// src/app/decentragram/page.tsx
"use client";

import Feed from "@/components/decentragram/Feed";
import styles from "./styles.module.css";

export default function DecentragramPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.logo}>Decentragram</h1>
      <Feed />
    </main>
  );
}
