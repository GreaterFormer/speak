import { Layout } from "antd";
import AppHeader from "./Header";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <AppHeader />
      <Content
        style={{
          padding: 20,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
