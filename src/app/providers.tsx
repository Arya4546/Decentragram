"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { somniaShannon } from "@/lib/somnia";

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  // eslint-disable-next-line no-console
  console.warn("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID in env");
}

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider client={client} activeChain={somniaShannon}>
      {children}
    </ThirdwebProvider>
  );
}
