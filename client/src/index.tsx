import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import theme from "./theme";
import App from "./App";

const { chains, publicClient } = configureChains([base], [publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "Practical Intent",
  projectId: "YOUR_PROJECT_ID",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const element = document.getElementById("root");
const root = createRoot(element!);

const Index = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        coolMode={true}
      >
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

root.render(<Index />);
