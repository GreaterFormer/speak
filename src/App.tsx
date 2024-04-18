import AppRouter from "routes";
import { ConfigProvider, theme } from "antd";
import { theme as customTheme } from "theme";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...customTheme,
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
};

export default App;
