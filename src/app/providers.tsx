"use client";
import { ThirdwebProvider } from "thirdweb/react";
import React from "react";

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  // eslint-disable-next-line no-console
  console.warn("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID in env");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}
