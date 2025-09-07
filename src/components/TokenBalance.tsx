"use client";
import { useMemo } from "react";
import { getContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc20";
import { somniaShannon } from "@/lib/somnia";
import { client } from "@/lib/client";

const contractAddress = process.env.NEXT_PUBLIC_DROP_ERC20!;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "STT";
const ZERO = "0x0000000000000000000000000000000000000000";

export default function TokenBalance() {
  const account = useActiveAccount();
  
  // build contract once (or undefined if no env yet)
  const contract = useMemo(() => {
    if (!contractAddress) return undefined;
    return getContract({ client, address: contractAddress, chain: somniaShannon });
  }, []);
  
  //  ALWAYS call the hook; just disable it when not ready
  const { data, isLoading, error } = useReadContract(balanceOf, {
    // TypeScript doesn't love undefined, but runtime is fine when disabled:
    contract: (contract as any),
    address: account?.address ?? ZERO,
    queryOptions: { enabled: !!account && !!contract },
  });
  
  // UI states
  if (!contractAddress) {
    return <div style={{ color: "#ffb4b4" }}>Missing NEXT_PUBLIC_DROP_ERC20 in env</div>;
  }
  if (!account) {
    return <div>Connect a wallet to see balance.</div>;
  }
  if (isLoading) {
    return <div>Loading balance…</div>;
  }
  if (error) {
    return <div style={{ color: "#ffb4b4" }}>Error: {String((error as any)?.message || error)}</div>;
  }
  
  return (
    <div className="row">
      <div>Balance:</div>
      <strong>{data?.toString() ?? "0"}</strong>
      <div>{TOKEN_SYMBOL}</div>
    </div>
  );
}
