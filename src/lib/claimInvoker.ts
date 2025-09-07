"use client";

import { getContract, sendTransaction } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc20";
import { somniaShannon } from "@/lib/somnia";
import { client } from "@/lib/client";
import type { Account } from "thirdweb/wallets";

const contractAddress = process.env.NEXT_PUBLIC_DROP_ERC20!;

export async function runSilentClaim(account: Account, amount: string) {
  if (!account) throw new Error("No wallet connected.");
  if (!contractAddress) throw new Error("Missing NEXT_PUBLIC_DROP_ERC20.");

  const contract = getContract({
    client,
    address: contractAddress,
    chain: somniaShannon,
  });

  const prepared = await claimTo({
    contract,
    to: account.address,
    quantity: amount,
  });

  const receipt = await sendTransaction({
    transaction: prepared,
    account,
  });

  return receipt;
}
