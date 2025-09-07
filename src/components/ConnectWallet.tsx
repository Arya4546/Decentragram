"use client";

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { somniaShannon } from "@/lib/somnia";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function ConnectWallet() {
  return (
    <div className="row">
      <ConnectButton
        client={client}
        chain={somniaShannon}
        theme="dark"
        connectButton={{
          label: "Connect Wallet",
        }}
        detailsButton={{
          displayBalanceToken: "STT",
        }}
      />
    </div>
  );
}
