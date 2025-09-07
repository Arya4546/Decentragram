import Link from "next/link";
import ConnectWallet from "@/components/ConnectWallet";
import TokenBalance from "@/components/TokenBalance";
import ClaimPanel from "@/components/ClaimPanel";

export default function Home() {
  return (
    <main>
      <section className="card" style={{ marginBottom: 16 }}>
        <h1>Somnia Shannon Testnet — Token Drop</h1>
        <p style={{ color: "#aab0c0" }}>Connect wallet and claim DropERC20 tokens.</p>
        <ConnectWallet />
      </section>

      <section className="card" style={{ marginBottom: 16 }}>
        <h2>Your Balance</h2>
        <TokenBalance />
      </section>

      <section className="card">
        <h2>Claim</h2>
        <ClaimPanel />
      </section>

      <footer>Network: Somnia Shannon Testnet (Chain ID 50312)</footer>
    
      <section style={{ marginTop: 24 }}>
        <Link href="/decentragram">
          <button className="btn">Go to Decentragram</button>
        </Link>
      </section>
    </main>
  );
}
