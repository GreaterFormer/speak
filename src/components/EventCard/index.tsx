import React, { useEffect } from "react";
import { Flex, Card, Avatar, Typography, Button, Divider, Row, Collapse, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Icon, {
  ClockCircleOutlined,
  StarOutlined,
  LinkOutlined,
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { selectBettingOption } from "store/slices/eventSlice";
import { fetchOrders, setBettingOptionLogs } from "store/slices/orderSlice";
import { apis } from "apis";

import ChartArea from "./components/ChartArea";
import OrderBook from "./components/OrderBook";
import MyOrders from "./components/MyOrders";
import Positions from "./components/Positions";
import BettingOptionButtons from "./components/BettingOptionButtons";

// Assets
import Logo from "assets/images/logo.png";
import LogoTitle from "assets/images/logo-title.png";
import { ReactComponent as CupSvg } from "assets/images/svgs/cup.svg";

import { RootState } from "store";


interface MarketListProps {
  eventInfo: any
}

const MarketList: React.FC<MarketListProps> = ({ eventInfo }) => {
  const dispatch = useDispatch();
  const [moreOrLessSwitch, setMoreOrLessSwitch] = React.useState(true);
  const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);
  const { orders } = useSelector((state: RootState) => state.orderKey);
  const [choice, setChoice] = React.useState(0);

  useEffect(() => {
    if (selectedBettingOption) {
      dispatch(fetchOrders({ bettingOptionUrl: selectedBettingOption.ipfsUrl }) as any);
    }
  }, [selectedBettingOption, dispatch])


  useEffect(() => {
    async function getResult() {
      if (selectedBettingOption) {
        // once bettingOption selected, then need to calculate tokenId for yes and no tokens.
        const response: any = await apis.GetEventLogs(selectedBettingOption.ipfsUrl);
        dispatch(setBettingOptionLogs(response.extractedLogs));
      }
    }
    getResult();
  }, [selectedBettingOption, orders, dispatch]);

  useEffect(() => {
    if (eventInfo) {
      dispatch(selectBettingOption(eventInfo.bettingOptions[0]) as any);
    }
  }, [eventInfo, dispatch]);

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
      <Divider />
      <Row>
        {(eventInfo && eventInfo.bettingOptions.length > 1) ?
          <Collapse
            style={{ width: '100%' }}
            accordion={true}
            items={eventInfo.bettingOptions.map((bettingOption: any) => {
              return {
                key: bettingOption.ipfsUrl,
                label: (
                  <Flex justify="space-between" onClick={() => {
                    setChoice(0);
                    dispatch(selectBettingOption(bettingOption) as any)
                  }
                  }>
                    <Flex gap={15} align="center">
                      {bettingOption.image ? (
                        <Avatar
                          shape="circle"
                          size={50}
                          src={`https://gateway.pinata.cloud/ipfs/${bettingOption.image}`}
                        />
                      ) : null}
                      <Flex vertical>
                        <Typography.Title level={5} style={{ margin: 0 }}>{bettingOption.title}</Typography.Title>
                        <Typography.Title level={5} style={{ margin: 0 }}>${bettingOption.bet} Bet</Typography.Title>
                      </Flex>
                    </Flex>
                    {bettingOption.result === 0 ? (
                      <Flex align="center">
                        <BettingOptionButtons bettingOption={bettingOption} />
                      </Flex>
                    ) : (
                      <Flex align="center">
                        <CheckCircleOutlined /> Result is {bettingOption.result == 1 ? "Yes" : "No"}
                      </Flex>
                    )}
                  </Flex>
                ),
                children: (
                  <Tabs
                    style={{ width: '100%' }}
                    activeKey={String(choice)}
                    onChange={(key: string) => setChoice(Number(key))}
                    items={[
                      {
                        key: '0',
                        label: 'ORDER BOOK',
                        children: <OrderBook />
                      },
                      {
                        key: '1',
                        label: 'GRAPH',
                        children: <ChartArea />
                      },
                      {
                        key: '2',
                        label: 'MY ORDERS',
                        children: <MyOrders />
                      },
                      {
                        key: '3',
                        label: 'POSITIONS',
                        children: <Positions />
                      }
                    ]}
                  />
                ),
                showArrow: false,
              }
            })} />
          :
          <Row style={{ width: '100%' }}>
            <ChartArea />
            <Positions />
            <Collapse
              style={{ width: '100%' }}
              accordion={true}
              items={[
                {
                  key: '0',
                  label: 'ORDER BOOK',
                  children: <OrderBook />,
                  showArrow: false
                }
              ]}
            />
            <MyOrders />
          </Row>
        }
      </Row>
      <Flex vertical justify="center" gap={5}>
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
