import React from "react";
import { Flex, Card, Avatar, Typography, Button, Row, Col } from "antd";
import Icon, {
  ClockCircleOutlined,
  StarOutlined,
  LinkOutlined,
  DollarOutlined,
} from "@ant-design/icons";

// Assets
import Logo from "assets/images/logo.png";
import LogoTitle from "assets/images/logo-title.png";
import { ReactComponent as CupSvg } from "assets/images/svgs/cup.svg";
import { colors } from "theme";

const rowStyle = {
  borderTop: "1px solid #444",
  borderBottom: "1px solid #444",
};

const data = [
  {
    avatar:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100",
    name: "Boston Celtics",
    percent: 35,
    amount: 31233,
  },
  {
    avatar:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100",
    name: "Milwaukee Bucks",
    percent: 6,
    amount: 3123,
  },
  {
    avatar:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100",
    name: "Boston Celtics",
    percent: 4,
    amount: 51233,
  },
  {
    avatar:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fceltics.png&w=256&q=100",
    name: "Boston Celtics",
    percent: 2,
    amount: 3133,
  },
];

interface MarketListProps {}

const MarketList: React.FC<MarketListProps> = ({}) => {
  const [hoverIndex, setHoverIndex] = React.useState(-1);
  const [currentIndex, setCurrentIndex] = React.useState(-1);

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

  return (
    <Card
      style={{ maxWidth: 800, width: "100%", padding: "30px 25px" }}
      styles={{
        body: { padding: 0 },
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex justify="space-between" align="center" gap={15}>
          <Avatar
            shape="square"
            size={72}
            src="https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fnba-champi_dee388fd5a61b48bfda70334b5a02837_256x256.webp&w=256&q=100"
          />
          <Flex vertical gap={5}>
            <Flex align="center" gap={15}>
              <Icon component={CupSvg} />
              <Typography.Text>$425,904 Bet</Typography.Text>
              <Flex align="center" gap={5}>
                <ClockCircleOutlined />
                <Typography.Text>Jun 6, 2024</Typography.Text>
              </Flex>
            </Flex>
            <Typography.Title level={3} style={{ margin: 0 }}>
              NBA Champion
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
      <Row style={{ marginTop: 20 }}>
        <Col span={8} style={{ ...rowStyle, padding: "10px 0px" }}>
          <Typography.Text>OUTCOME</Typography.Text>
        </Col>
        <Col
          span={8}
          style={{ ...rowStyle, padding: "10px 0px", textAlign: "center" }}
        >
          <Typography.Text>% CHANCE</Typography.Text>
        </Col>
        <Col span={8} style={{ ...rowStyle, padding: "10px 0px" }}></Col>
      </Row>
      {data.map((item, index) => (
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
      ))}
    </Card>
  );
};

export default MarketList;
