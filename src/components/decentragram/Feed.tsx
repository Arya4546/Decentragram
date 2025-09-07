"use client";
import { useEffect, useState } from "react";
import Uploader from "./Uploader";
import styles from "./styles.module.css";

type Post = {
  id: string;
  owner: string;
  ipfsHash: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/pinata", { cache: "no-store" });
      const json = await res.json();
      setPosts((json.posts || []).sort((a: Post, b: Post) => b.createdAt - a.createdAt));
    } catch (e) {
      console.error("Feed load failed:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.grid}>
      <section className={styles.leftCol}>
        <Uploader onCreated={() => load()} />
      </section>

      <section className={styles.feed}>
        {loading ? (
          <div className={styles.skeleton} />
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.cloud1}></div>
            <div className={styles.cloud2}></div>
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className={styles.cards}>
            {posts.map((p) => (
              <article key={p.id} className={styles.postCard}>
                <header className={styles.postHeader}>
                  <div className={styles.avatar} title={p.owner}>
                    {p.owner.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.owner}>
                      {p.owner.slice(0, 6)}…{p.owner.slice(-4)}
                    </div>
                    <div className={styles.time}>
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                </header>
                <div className={styles.imageWrap}>
                  <img src={p.imageUrl} alt={p.caption} />
                </div>
                <p className={styles.caption}>{p.caption}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
