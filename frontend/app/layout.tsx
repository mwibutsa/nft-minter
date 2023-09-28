"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import {
  sepolia,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
} from "@wagmi/core/chains";
import { Theme } from "@radix-ui/themes";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    walletConnectProjectId: "demo",
    appName: "Koinect NFT Minter",
    chains: [sepolia, goerli, mainnet, polygon, polygonMumbai],
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Koinect NFT Minter</title>
      </head>
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <body>
            <Theme>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "105vh",
                }}
              >
                <Navbar />
                <div style={{ flexGrow: 1 }}>{children}</div>
                <Footer />
              </div>
            </Theme>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
