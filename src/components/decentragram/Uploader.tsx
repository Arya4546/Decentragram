"use client";

import { useState, useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { runSilentClaim } from "@/lib/claimInvoker";
import styles from "./styles.module.css";

type Post = {
  id: string;
  owner: string;
  ipfsHash: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
};

export default function Uploader({ onCreated }: { onCreated: (p: Post) => void }) {
  const account = useActiveAccount(); // returns Account | undefined
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "claim" | "pin" | "done">("idle");

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  async function handleUpload() {
    if (!account) return alert("Connect your MetaMask first.");
    if (!file) return alert("Select an image first.");

    try {
      setUploading(true);
      setPhase("claim");

      // 1) run claim silently (uses SAME claim path as ClaimPanel under the hood)
      const amount =
        process.env.NEXT_PUBLIC_CLAIM_PER_POST ||
        ((process.env as any).CLAIM_PER_POST as string) ||
        "1";
      await runSilentClaim(account, amount); // <-- pass the full account object

      // 2) pin to Pinata via our Next.js API route
      setPhase("pin");
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);

      const res = await fetch("/api/pinata", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");

      const ipfsHash = json.IpfsHash as string;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      const post: Post = {
        id: crypto.randomUUID(),
        owner: account.address,
        ipfsHash,
        imageUrl,
        caption,
        createdAt: Date.now(),
      };

      if (typeof window !== "undefined") {
        const key = "decentragram_posts";
        const list = JSON.parse(localStorage.getItem(key) || "[]") as Post[];
        localStorage.setItem(key, JSON.stringify([post, ...list]));
      }

      onCreated(post);
      setCaption("");
      setFile(null);
      setPhase("done");
    } catch (e: any) {
      alert(e?.message || "Something went wrong.");
    } finally {
      setUploading(false);
      setPhase("idle");
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Create Post</h3>
        <p className={styles.cardDesc}>
          We&apos;ll finalize on-chain, then pin your image to Pinata/IPFS.
        </p>
      </div>
      <div className={styles.cardBody}>
        <label className={styles.filePicker}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span>{file ? "Change image" : "Choose image"}</span>
        </label>

        {preview && (
          <div className={styles.previewWrap}>
            <img src={preview} className={styles.preview} />
          </div>
        )}

        <textarea
          className={styles.input}
          placeholder="Write a fun caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
        />
        <button className={styles.cta} onClick={handleUpload} disabled={isUploading}>
          {isUploading
            ? phase === "claim"
              ? "Finalizing…"
              : phase === "pin"
              ? "Pinning to IPFS…"
              : "Working…"
            : "Post"}
        </button>
      </div>
    </div>
  );
}
