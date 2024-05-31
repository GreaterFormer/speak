import { Layout, Flex, Input, Button, Divider, Tooltip, Typography, Dropdown, type MenuProps, Avatar } from "antd";
import Icon, { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { UserOutlined } from '@ant-design/icons';
// Assets
import Logo from "assets/images/logo.png";
import LogoTitle from "assets/images/logo-title.png";
import { ReactComponent as CupSvg } from "assets/images/svgs/cup.svg";
import { ReactComponent as FlagSvg } from "assets/images/svgs/flag.svg";
import { ReactComponent as GridSvg } from "assets/images/svgs/grid.svg";
import { ReactComponent as WaveSvg } from "assets/images/svgs/wave.svg";
import { Link, useNavigate } from "react-router-dom";
import { setOpenLoginModal } from "store/slices/appSlice";
import store from "store";
import LoginModal from "components/Modals/LoginModal";
import { useLocalStorage } from "usehooks-ts";
import { AUTH_TOKEN } from "constant";
import { roundToTwo } from "utils";
import { useDisconnect } from 'wagmi'

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
  const navigate = useNavigate();
  const { correspondingAddress } = useSelector((state: RootState) => state.userKey);
  const [currentMoney] = useLocalStorage<number>('currentMoney', 0)
  const [_, setAccessToken] = useLocalStorage<string>(AUTH_TOKEN, '')
  const { disconnectAsync } = useDisconnect()

  const handleLoggedIn = (auth: any) => {
    const { accessToken } = auth;
    setAccessToken(accessToken);
    store.dispatch(setOpenLoginModal(false));
  }

  const onLogout = async () => {
    setAccessToken('');
    await disconnectAsync();
  }

  const goToMoneyPage = () => {
    navigate("/money")
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={goToMoneyPage}>
          Deposit & Withdraw
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={onLogout}>
          Logout
        </a>
      ),
    },
  ];

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
              <Link to="/" style={{ lineHeight: 0 }}>
                <Flex gap={5}>
                  <img src={Logo} height={45} alt="logo" />
                  <img src={LogoTitle} height={45} alt="logo-title" />
                </Flex>
              </Link>
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
              <Flex gap={10} align="center">
                <Tooltip title="Ranks">
                  <Button icon={<Icon component={CupSvg} />} />
                </Tooltip>
                <Tooltip title="Election">
                  <Button icon={<Icon component={FlagSvg} />} />
                </Tooltip>
                <Link to="/markets" style={{ lineHeight: 0 }}>
                  <Tooltip title="Markets">
                    <Button icon={<Icon component={GridSvg} />} />
                  </Tooltip>
                </Link>
                <Tooltip title="Activity">
                  <Button icon={<Icon component={WaveSvg} />} />
                </Tooltip>
              </Flex>
              <Flex gap={10} align="center">
                {correspondingAddress ?
                  <Flex gap={10} align="center">
                    <Flex vertical>
                      <Typography.Title level={5} style={{ margin: 0 }}>Balance: ${roundToTwo(currentMoney)}</Typography.Title>
                      <Tooltip title={correspondingAddress} placement="left" color="purple">
                        <Typography.Title level={5} style={{ margin: 0 }}>{correspondingAddress.substring(0, 5)}...{correspondingAddress.substring(correspondingAddress.length - 3, correspondingAddress.length)}</Typography.Title>
                      </Tooltip>
                    </Flex>
                    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                      <Avatar size={40} icon={<UserOutlined />} />
                    </Dropdown>
                  </Flex>
                  :
                  <>
                    <Button
                      size="large"
                      style={{
                        backgroundColor: "black",
                      }}
                      onClick={() => store.dispatch(setOpenLoginModal(true))}
                    >
                      Log In
                    </Button>
                    <Button size="large" type="primary" onClick={() => store.dispatch(setOpenLoginModal(true))}>
                      Sign Up
                    </Button>
                  </>
                }
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
      <LoginModal handleLoggedIn={handleLoggedIn} />
    </>
  );
};

export default AppHeader;
