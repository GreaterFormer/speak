import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from "routes";
import { Buffer } from 'buffer'
import { ConfigProvider, theme } from "antd";
import { theme as customTheme } from "theme";
import store from "store";
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi.ts'

globalThis.Buffer = Buffer

const App = () => {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              ...customTheme,
            }}
          >
            <AppRouter />
          </ConfigProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
