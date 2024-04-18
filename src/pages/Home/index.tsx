import { Flex } from "antd";
import BuySellCard from "components/BuySellCard";
import Discord from "components/Discord";
import MarketList from "components/MarketList";

const Home = () => {
  return (
    <div style={{ maxWidth: 1200, width: "100%", margin: "0px auto" }}>
      <Flex gap={20}>
        <MarketList />
        <BuySellCard />
      </Flex>
      <Discord />
    </div>
  );
};

export default Home;
