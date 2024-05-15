import React, { useEffect } from "react";
import { Flex, Card, Avatar, Typography, Button, Divider, Row, Col } from "antd";

import Icon, {
  ClockCircleOutlined,
  StarOutlined,
  LinkOutlined,
  DollarOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { selectBettingOption } from "store/slices/eventSlice";
import { fetchOrders, setBettingOptionLogs } from "store/slices/orderSlice";
import { apis } from "apis";

import ChartArea from "./ChartArea";

// Assets
import Logo from "assets/images/logo.png";
import LogoTitle from "assets/images/logo-title.png";
import { ReactComponent as CupSvg } from "assets/images/svgs/cup.svg";
import { colors } from "theme";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store";
import OrderBook from "./OrderBook";

// const rowStyle = {
//   borderTop: "1px solid #444",
//   borderBottom: "1px solid #444",
// };

// const data = [
//   {
//     avatar:
//       "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100",
//     name: "Boston Celtics",
//     percent: 35,
//     amount: 31233,
//   },
// ];

interface MarketListProps {
  eventInfo: any
}

const MarketList: React.FC<MarketListProps> = ({ eventInfo }) => {
  const dispatch = useDispatch();
  const [hoverIndex, setHoverIndex] = React.useState(-1);
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  const [moreOrLessSwitch, setMoreOrLessSwitch] = React.useState(true);
  const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);
  const { orders } = useSelector((state: RootState) => state.orderKey);

  const MarketItem = ({
    avatar,
    name,
    amount,
  }: {
    avatar: string;
    name: string;
    amount: number;
  }) => (
    <Flex align="center" gap={10}>
      <Avatar src={avatar} size={40} />
      <Flex vertical>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {name}
        </Typography.Title>
        <Flex gap={5} align="center">
          <Typography.Text style={{ fontSize: 13, color: colors.grey }}>
            ${amount.toLocaleString()}
          </Typography.Text>
          <DollarOutlined style={{ color: colors.grey }} />
        </Flex>
      </Flex>
    </Flex>
  );

  useEffect(() => {
    if (selectedBettingOption) {
      dispatch(fetchOrders({ bettingOptionUrl: selectedBettingOption.ipfsUrl }) as any);
    }
  }, [selectedBettingOption])


  useEffect(() => {
    async function getResult() {
      if (selectedBettingOption) {
        // once bettingOption selected, then need to calculate tokenId for yes and no tokens.
        const response: any = await apis.GetEventLogs(selectedBettingOption.ipfsUrl);
        dispatch(setBettingOptionLogs(response.extractedLogs));
      }
    }
    getResult();
  }, [selectedBettingOption, orders]);

  useEffect(() => {
    if (eventInfo) {
      dispatch(selectBettingOption(eventInfo.bettingOptions[0]) as any);
    }
  }, [eventInfo])

  return (
    <Card
      style={{ maxWidth: 800, width: "100%", padding: "30px 25px" }}
      styles={{
        body: { padding: 0 },
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex justify="space-between" align="center" gap={15}>
          {eventInfo ? <Avatar
            shape="square"
            size={72}
            src={`https://gateway.pinata.cloud/ipfs/${eventInfo.image}`}
          /> : null}
          <Flex vertical gap={5}>
            <Flex align="center" gap={15}>
              <Typography.Text>{eventInfo?.category}</Typography.Text>
              <Icon component={CupSvg} />
              <Typography.Text>${eventInfo?.bettingOptions.reduce((sum: any, bettingOption: { bet: any; }) => sum + bettingOption.bet, 0)} Bet</Typography.Text>
              <Flex align="center" gap={5}>
                <ClockCircleOutlined />
                <Typography.Text>Expires {new Date(eventInfo?.endDate).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</Typography.Text>
              </Flex>
            </Flex>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {eventInfo?.title}
            </Typography.Title>
          </Flex>
        </Flex>

        <Flex vertical justify="center" gap={5}>
          <Flex justify="flex-end">
            <Button type="text" icon={<StarOutlined />} />
            <Button type="text" icon={<LinkOutlined />} />
          </Flex>
          <Flex gap={5}>
            <img src={Logo} height={32} alt="logo" />
            <img src={LogoTitle} height={32} alt="logo-title" />
          </Flex>
        </Flex>
      </Flex>

      <ChartArea />
      {/* <Positions /> */}
      {/* <MyOrders /> */}

      <Divider orientation="left">Order Book</Divider>
      <OrderBook />

      {/* {data.map((item, index) => (
        <Row
          key={index}
          onClick={() => {
            if (currentIndex === -1) setCurrentIndex(index);
            else if (currentIndex === index) setCurrentIndex(-1);
            else setCurrentIndex(index);
          }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(-1)}
          style={{
            cursor: "pointer",
            backgroundColor: hoverIndex === index ? "#222222" : undefined,
          }}
        >
          <Col
            span={8}
            style={{ borderBottom: "1px solid #444", padding: "20px 0px" }}
          >
            <MarketItem
              amount={item.amount}
              avatar={item.avatar}
              name={item.name}
            />
          </Col>
          <Col
            span={8}
            style={{
              borderBottom: "1px solid #444",
              padding: "20px 0px",
              textAlign: "center",
            }}
          >
            <Typography.Title level={2} style={{ margin: 0 }}>
              {item.percent}%
            </Typography.Title>
          </Col>
          <Col
            span={8}
            style={{ borderBottom: "1px solid #444", padding: "20px 0px" }}
          >
            <Flex gap={10} justify="flex-end">
              <Button type="primary" size="large">
                Yes 44¢
              </Button>
              <Button size="large">No 57¢</Button>
            </Flex>
          </Col>
          <Col
            span={24}
            style={{
              textAlign: "center",
              height: currentIndex === index ? 50 : 0,
              overflow: "hidden",
              transition: "height 0.3s ease-out",
            }}
          >
            Content
          </Col>
        </Row>
      ))} */}

      <Flex vertical justify="center" gap={5} style={{ marginTop: 20 }}>
        <Divider orientation="left">About</Divider>
        {
          moreOrLessSwitch ? (<Typography.Text style={{ maxHeight: '2.5rem', overflow: 'hidden' }}>
            {eventInfo?.detail}
          </Typography.Text>) : (<Typography.Text>
            {eventInfo?.detail}
          </Typography.Text>)
        }

        <Button type="text" onClick={() => setMoreOrLessSwitch(!moreOrLessSwitch)}>Show {moreOrLessSwitch ? "more" : "less"} {moreOrLessSwitch ? <DownOutlined /> : <UpOutlined />}</Button>
      </Flex>

    </Card>
  );
};

export default MarketList;
