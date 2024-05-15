import { Provider } from "react-redux";
import AppRouter from "routes";
import { ConfigProvider, theme } from "antd";
import { theme as customTheme } from "theme";
import store from "store";
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi.ts'

const App = () => {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
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
    </WagmiProvider>
  );
};

export default App;
