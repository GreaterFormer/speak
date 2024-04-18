import React from "react";
import {
  Flex,
  Button,
  Card,
  Avatar,
  Typography,
  Tabs,
  Dropdown,
  type MenuProps,
  Space,
  Input,
} from "antd";
import { DownOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface BuySellCardProps {}

const BuySellCard: React.FC<BuySellCardProps> = ({}) => {
  const [tab, setTab] = React.useState<string>("BUY");
  const [type, setType] = React.useState<string>("Market");
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Space onClick={() => setType("Market")}>Market</Space>,
    },
    {
      key: "2",
      label: <Space onClick={() => setType("Limit")}>Limit</Space>,
    },
    {
      key: "3",
      label: <Space onClick={() => setType("AMM")}>AMM</Space>,
    },
  ];

  const Content = () => (
    <div style={{ margin: "20px 25px 0px 25px" }}>
      <Flex align="center" justify="space-between">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Outcome
        </Typography.Title>
        <Flex>
          <></>
        </Flex>
      </Flex>
      <Flex justify="center" style={{ marginTop: 10 }} gap={10}>
        <Button type="primary" size="large" style={{ width: "50%" }}>
          Yes 46¢
        </Button>
        <Button size="large" style={{ width: "50%", backgroundColor: "black" }}>
          No 55¢
        </Button>
      </Flex>

      <Typography.Title level={4} style={{ margin: "20px 0px 10px 0px" }}>
        Amount
      </Typography.Title>
      <Flex vertical gap={10}>
        <Input
          size="large"
          addonBefore={<MinusOutlined style={{ cursor: "pointer" }} />}
          addonAfter={<PlusOutlined style={{ cursor: "pointer" }} />}
          defaultValue={0}
          style={{
            textAlign: "center",
          }}
        />
        <Button type="primary" size="large">
          Log In
        </Button>
      </Flex>

      <Flex vertical style={{ marginTop: 10 }}>
        <Flex justify="space-between">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Avg price
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            0¢
          </Typography.Title>
        </Flex>
        <Flex justify="space-between">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Shares
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            0.00
          </Typography.Title>
        </Flex>
        <Flex justify="space-between">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Potential return
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            $0.00 (0.00%)
          </Typography.Title>
        </Flex>
      </Flex>
    </div>
  );

  return (
    <Card
      style={{
        width: 340,
        padding: "30px 0px",
        height: "fit-content",
      }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Flex align="center" gap={10} style={{ margin: "0px 25px" }}>
        <Avatar
          size={40}
          src="https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100"
        />
        <Typography.Title level={5} style={{ margin: 0 }}>
          Boston Celtics
        </Typography.Title>
      </Flex>
      <Tabs
        activeKey={tab}
        onChange={(key: string) => setTab(key)}
        size="large"
        tabBarStyle={{
          padding: "5px 25px 0px 25px",
          margin: 0,
        }}
        tabBarGutter={20}
        tabBarExtraContent={
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Space style={{ cursor: "pointer" }}>
              {type}
              <DownOutlined style={{ fontSize: 10 }} />
            </Space>
          </Dropdown>
        }
        items={[
          {
            key: "BUY",
            label: "Buy",
            children: <Content />,
          },
          {
            key: "SELL",
            label: "Sell",
            children: <Content />,
          },
        ]}
      />
    </Card>
  );
};

export default BuySellCard;
