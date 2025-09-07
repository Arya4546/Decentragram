import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Somnia Claim Web",
  description: "Wallet connect + Token Drop claim on Somnia Shannon Testnet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
