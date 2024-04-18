import { Layout, Flex, Input, Button, Divider } from "antd";
import Icon, { SearchOutlined } from "@ant-design/icons";

// Assets
import Logo from "assets/images/logo.png";
import LogoTitle from "assets/images/logo-title.png";
import { ReactComponent as CupSvg } from "assets/images/svgs/cup.svg";
import { ReactComponent as FlagSvg } from "assets/images/svgs/flag.svg";
import { ReactComponent as GridSvg } from "assets/images/svgs/grid.svg";
import { ReactComponent as WaveSvg } from "assets/images/svgs/wave.svg";

const { Header, Content } = Layout;

const navItems = [
  "All",
  "New",
  "Ended",
  "Volume",
  "Liquidity",
  "Politics",
  "Middle East",
  "Sports",
  "Crypto",
  "Pop Culture",
  "Business",
  "Science",
];

const AppHeader = () => {
  return (
    <>
      <Header
        style={{
          height: "fit-content",
          backgroundColor: "#000",
        }}
      >
        <Content
          style={{
            margin: "25px 0px",
          }}
        >
          <Flex justify="space-between" align="center">
            <Flex gap={40}>
              <Flex gap={5}>
                <img src={Logo} height={45} alt="logo" />
                <img src={LogoTitle} height={45} alt="logo-title" />
              </Flex>
              <Input
                size="small"
                placeholder="Search Markets"
                prefix={
                  <SearchOutlined
                    style={{
                      color: "#FFF",
                      padding: "0px 10px",
                    }}
                  />
                }
                style={{
                  width: 320,
                  borderRadius: 10,
                }}
              />
            </Flex>
            <Flex gap={20} align="center">
              <Flex gap={10}>
                <Button icon={<Icon component={CupSvg} />} />
                <Button icon={<Icon component={FlagSvg} />} />
                <Button icon={<Icon component={GridSvg} />} />
                <Button icon={<Icon component={WaveSvg} />} />
              </Flex>
              <Flex gap={10} align="center">
                <Button
                  size="large"
                  style={{
                    backgroundColor: "black",
                  }}
                >
                  Log In
                </Button>
                <Button size="large" type="primary">
                  Sign Up
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Content>
      </Header>
      <Divider style={{ margin: 0, borderColor: "#444", borderWidth: 1 }} />
      <Flex
        justify="center"
        align="center"
        gap={10}
        style={{ margin: "15px 0px" }}
      >
        {navItems.map((item: string, index: number) => (
          <Button type="text" size="large" key={index}>
            {item}
          </Button>
        ))}
      </Flex>
      <Divider style={{ margin: 0, borderColor: "#444", borderWidth: 1 }} />
    </>
  );
};

export default AppHeader;
