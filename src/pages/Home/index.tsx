import { Flex } from "antd";
import BuySellCard from "components/BuySellCard";
import MarketList from "components/MarketList";

const Home = () => {
  return (
    <Flex
      gap={20}
      style={{ maxWidth: 1200, width: "100%", margin: "0px auto" }}
    >
      <MarketList />
      <BuySellCard />
    </Flex>
  );
};

export default Home;
