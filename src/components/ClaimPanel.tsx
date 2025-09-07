"use client";

import { useMemo, useState } from "react";
import { getContract, sendTransaction } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { somniaShannon } from "@/lib/somnia";
import { client } from "@/lib/client";

const contractAddress = process.env.NEXT_PUBLIC_DROP_ERC20!;
const EXPLORER = "https://shannon-explorer.somnia.network"; // testnet explorer

export default function ClaimPanel() {
  const account = useActiveAccount();
  const [qty, setQty] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!contractAddress) {
    return <div style={{ color: "#ffb4b4" }}>Missing NEXT_PUBLIC_DROP_ERC20 in env</div>;
  }

  // Create contract once
  const contract = useMemo(
    () => getContract({ client, address: contractAddress, chain: somniaShannon }),
    []
  );

  const onClaim = async () => {
    if (!account) return alert("Connect a wallet first");

    const raw = (qty || "").trim();
    if (raw === "") return alert("Enter amount to claim");
    if (!/^\d+(\.\d+)?$/.test(raw)) return alert("Enter a valid number");
    if (Number(raw) <= 0) return alert("Enter a positive amount");

    try {
      setLoading(true);

      // 1) Build tx from helper (expects quantity as STRING, human-readable)
      const prepared = await claimTo({
        contract,
        to: account.address,
        quantity: raw, // e.g. "1" or "0.5" (helper handles decimals)
      });

      // 2) Send it with the connected account
      const receipt = await sendTransaction({
        transaction: prepared,
        account,
      });

      console.log("Claim success:", receipt);
      const hash = (receipt as any)?.transactionHash || (receipt as any)?.hash;
      if (hash) {
        alert(`Claim successful!\n\nView: ${EXPLORER}/tx/${hash}`);
      } else {
        alert("Claim successful!");
      }

      setQty("");
    } catch (e: any) {
      console.error(e);
      alert(e?.shortMessage || e?.message || "Claim failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <input
        type="number"
        min={0}
        step="any"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="Amount to claim"
      />
      <button className="btn" onClick={onClaim} disabled={loading}>
        {loading ? "Claiming…" : "Claim"}
      </button>
    </div>
  );
}
