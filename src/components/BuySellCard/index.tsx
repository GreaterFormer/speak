import React from "react";
import {
  Flex,
  Button,
  Card,
  Typography,
  Tabs,
  Dropdown,
  type MenuProps,
  Space,
  Input,
  Spin
} from "antd";
import Web3 from 'web3';
import { DownOutlined, MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setBuyOrSell, fetchOrders, setShowNo } from "store/slices/orderSlice";
import { AUTH_TOKEN, BUY, SELL } from "constant";
import { mergeElements } from "utils";
import { apis } from "apis";
import { BigNumberish, formatUnits, parseUnits } from 'ethers';
import { useLocalStorage } from "usehooks-ts";
import { RootState } from "store";
import { roundToTwo } from "utils";
import { colors } from "theme";
import store from "store";
import { setOpenLoginModal } from "store/slices/appSlice";
import CTFExchangeContract from "artifacts/contracts/papaya/CTFExchangeContract.json";
import { useSignTypedData, useAccount } from 'wagmi';
import { switchChain } from '@wagmi/core';
import { pulsechainV4 } from '@wagmi/core/chains';
import { config } from "../../wagmi";
import { BettingStyle } from "types";

interface BuySellCardProps { }

const BuySellCard: React.FC<BuySellCardProps> = ({ }) => {
  const { signTypedDataAsync } = useSignTypedData()
  const { address: signerAddress } = useAccount()

  const dispatch = useDispatch();
  const [tab, setTab] = React.useState<string>("BUY");

  const ref = React.useRef<any>(null);
  const [currentMoney, setCurrentMoney] = useLocalStorage<number>('currentMoney', 0);
  const { orders, showNo, buyOrSell } = useSelector((state: RootState) => state.orderKey);
  const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);
  const { correspondingAddress, publicAddress } = useSelector((state: RootState) => state.userKey);

  const [bettingStyle, setBettingStyle] = React.useState(BettingStyle.Limit);
  const [yesShares, setYesShares] = React.useState(0);
  const [noShares, setNoShares] = React.useState(0);
  const [chainId, setChainId] = React.useState<number>(pulsechainV4.id)
  const [insufficientBalance, setInsufficientBalance] = React.useState(false);

  const [avgValue, setAvgValue] = React.useState(50);
  const [predictedShares, setPredictedShares] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [estimatedAmountReceived, setEstimatedAmountReceived] = React.useState(0);
  const [limitPrice, setLimitPrice] = React.useState(0);
  const [shares, setShares] = React.useState(0);
  const [accessToken] = useLocalStorage<string>(AUTH_TOKEN, '')
  const [isProgressing, setIsProgressing] = React.useState(false);

  const [yesValue, setYesValue] = React.useState(50);
  const [noValue, setNoValue] = React.useState(50);

  const items: MenuProps["items"] = [
    {
      key: BettingStyle.Limit,
      label: <Space onClick={() => setBettingStyle(BettingStyle.Limit)}>Limit</Space>,
    },
    {
      key: BettingStyle.Market,
      label: <Space onClick={() => setBettingStyle(BettingStyle.Market)}>Market</Space>,
    },
  ];

  React.useEffect(() => {
    async function getResult() {
      if (selectedBettingOption && accessToken != '') {
        apis.GetConditionalBalance({
          ipfsUrl: selectedBettingOption.ipfsUrl,
          isYes: true
        }).then((response: any) => {
          const { balance } = response;
          setYesShares(Number(formatUnits(balance as BigNumberish, 6)));
        }).catch(err => {
          console.error(err);
          setYesShares(0);
        });

        apis.GetConditionalBalance({
          ipfsUrl: selectedBettingOption.ipfsUrl,
          isYes: false
        }).then((response: any) => {
          const { balance } = response;
          setNoShares(Number(formatUnits(balance as BigNumberish, 6)))
        }).catch(err => {
          console.error(err);
          setNoShares(0);
        });
      } else {
        setYesShares(0);
        setNoShares(0);
      }
    }
    getResult();
  }, [selectedBettingOption, accessToken, orders]);

  const fetchBalance = (address: string) => {
    if (address && address != '') {
      apis.GetBalance(address)
        .then((response: any) => {
          const { balance, decimals } = response;
          setCurrentMoney(Number(formatUnits(balance, Number(decimals))));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCurrentMoney(0);
    }
  }

  React.useEffect(() => {
    const getChainId = async () => {
      // console.log(window.ethereum.chainId);
      // await window.ethereum.request({ method: 'eth_chainId' })
      // .then((chainId: number) => {
      //     console.log("Connected chain ID:", chainId);
      //     setChainId(chainId);
      // })
      // .catch((error: any) => console.error(error));
      // Check if Coinbase Wallet is installed
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        // Get the current chain ID
        web3.eth.net.getId()
          .then((_chainId: any) => {
            let chain_id = Number(_chainId)
            console.log(`Chain id is ${chain_id}`)
            setChainId(chain_id);
            // You can use the chainId for your application logic here
          })
          .catch((error: any) => {
            console.error('Error getting chain ID: ', error);
          });

        // Subscribe to chain changes
        window.ethereum.on('chainChanged', (_chainId: any) => {
          // Handle chain change event
          console.log('Chain changed to: ', _chainId);
          // Update your application based on the new chain ID
        });
      } else {
        console.log('Coinbase Wallet is not installed');
      }
    };

    getChainId();
  }, [])

  window.ethereum.on('chainChanged', (chainId: number) => {
    console.log("Chain switched to:", chainId);
    setChainId(chainId);
  });

  const refreshOrders = async () => {
    if (selectedBettingOption)
      dispatch(fetchOrders({ bettingOptionUrl: selectedBettingOption.ipfsUrl }) as any);
    fetchBalance(correspondingAddress);
  }

  const generateRandomSalt = () => {
    // Create a typed array to store the salt (4 bytes for int64)
    const saltArray = new Uint32Array(1);
    // Fill the typed array with random values
    crypto.getRandomValues(saltArray);
    // Combine the two 32-bit integers into a single int64 value
    return saltArray[0];
  }

  const handleBuySellClick = async () => {
    let collateralAmount, conditionalTokenAmount;

    let _yesOrders = orders.map(order => {
      const { tokenId, makerAmount, takerAmount, side } = order;
      let price = side == 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount;

      if (tokenId == selectedBettingOption?.yesTokenId) return {
        price,
        isBuy: side == 0 ? true : false,
        ...order
      }
      else return {
        price: 100 - price,
        isBuy: side == 1 ? true : false,
        ...order
      }
    });

    let _orders = _yesOrders;
    if (showNo) {
      _orders = _orders.map(order => {
        const { price, isBuy, ...rest } = order;
        return {
          price: 100 - price,
          isBuy: !isBuy,
          ...rest
        }
      })
    }

    let makerOrders = [];
    let takerFillAmount = 0;
    let makerFillAmounts = [];

    if (bettingStyle == BettingStyle.Market) {
      if (buyOrSell == BUY) {
        collateralAmount = Number(amount);
        conditionalTokenAmount = predictedShares;
        // need to calculate takerFillAmount and makerFillAmounts, and pick makerOrders.
        // first step is to sort orders 
        let remain = Number(amount) * 1000000;

        const sortedOrders = _orders.filter(order => order.isBuy == false).sort((a, b) => a.price - b.price);
        if (sortedOrders.length > 0) {
          let lastOrderPrice = 0;
          for (let i = 0; i < sortedOrders.length; i++) {
            let order = sortedOrders[i];
            lastOrderPrice = order.price;
            if (remain >= order.price * order.shares / 100) {
              makerOrders.push(order);

              if (order.side == 0) {
                makerFillAmounts.push(Math.floor((100 - order.price) * order.shares / 100));
              } else { // this means sell token, so token count needed
                makerFillAmounts.push(Math.floor(order.shares));
              }
              remain -= order.price * order.shares / 100;
            } else {
              makerOrders.push(order);

              if (order.side == 0) {
                makerFillAmounts.push(Math.floor((100 - order.price) * remain / order.price));
              } else {
                makerFillAmounts.push(Math.floor(remain * 100 / order.price));
              }
              remain = 0;
              break;
            }
          }
          if (remain > 0) {
            lastOrderPrice = 100;
          }
          conditionalTokenAmount = collateralAmount * 100 / lastOrderPrice;
          takerFillAmount = Math.floor(Number(amount) * 1000000 - remain);
        }

      } else { // Sell Token
        collateralAmount = estimatedAmountReceived;
        conditionalTokenAmount = Number(shares);

        let remainingShares = Number(shares) * 1000000;
        const sortedOrders = _orders.filter(order => order.isBuy == true).sort((a, b) => a.price - b.price);

        if (sortedOrders.length > 0) {
          let lastOrderPrice = 0;
          for (let i = 0; i < sortedOrders.length; i++) {
            let order = sortedOrders[i];
            lastOrderPrice = order.price;
            if (remainingShares >= order.shares) {
              makerOrders.push(order);

              if (order.side == 0) { // if buy order, then put collateral amount
                makerFillAmounts.push(Math.floor(order.price * order.shares));
              } else { // if sell order, then put complement 
                makerFillAmounts.push(Math.floor(order.shares));
              }
              remainingShares -= order.shares;
            } else {
              makerOrders.push(order);
              if (order.side == 0) {
                makerFillAmounts.push(Math.floor(order.price * remainingShares));
              } else {
                makerFillAmounts.push(Math.floor(remainingShares));
              }
              remainingShares = 0;
              break;
            }
          }
          if (remainingShares > 0) {
            lastOrderPrice = 0;
          }
          collateralAmount = conditionalTokenAmount * lastOrderPrice / 100;
          takerFillAmount = Math.floor(Number(shares) * 1000000 - remainingShares);
        }
      }
    } else { // limit
      collateralAmount = Number(shares) * Number(limitPrice) / 100;
      conditionalTokenAmount = Number(shares);
      let remainingShares = Number(shares) * 1000000;
      if (buyOrSell == BUY) {
        const sortedOrders = _orders.filter(order => order.isBuy == false).sort((a, b) => a.price - b.price);
        if (sortedOrders.length > 0) {
          for (let i = 0; i < sortedOrders.length; i++) {
            let order = sortedOrders[i];
            if (order.price > Number(limitPrice)) break;

            if (remainingShares >= order.shares) {
              makerOrders.push(order);

              if (order.side == 0) { // buy complement, need to register collateral amount.    
                makerFillAmounts.push(Math.floor((100 - order.price) * order.shares / 100));
              } else { // sell token
                makerFillAmounts.push(Math.floor(order.shares));
              }
              takerFillAmount += Math.floor(order.price * order.shares / 100);
              remainingShares -= order.shares;
            } else {
              makerOrders.push(order);

              if (order.side == 0) {
                makerFillAmounts.push(Math.floor((100 - order.price) * remainingShares / 100));
              } else {
                makerFillAmounts.push(Math.floor(remainingShares));
              }
              takerFillAmount += Math.floor(order.price * remainingShares / 100);
              remainingShares = 0;
              break;
            }

          }
        }
      } else { // sell token
        const sortedOrders = _orders.filter(order => order.isBuy == true).sort((a, b) => a.price - b.price);
        if (sortedOrders.length > 0) {
          for (let i = 0; i < sortedOrders.length; i++) {
            let order = sortedOrders[i];
            if (order.price < Number(limitPrice)) break;

            if (remainingShares > order.shares) {
              makerOrders.push(order);

              if (order.side == 0) { // buy token
                makerFillAmounts.push(Math.floor(order.price * order.shares / 100));
              } else { // sell complement
                makerFillAmounts.push(Math.floor(order.shares));
              }
              remainingShares -= order.shares;
            } else {
              makerOrders.push(order);

              if (order.side == 0) {
                makerFillAmounts.push(Math.floor(order.price * remainingShares / 100));
              } else {
                makerFillAmounts.push(Math.floor(remainingShares));
              }
              remainingShares = 0;
              break;
            }
          }
          takerFillAmount = Math.floor(Number(shares) * 1000000 - remainingShares);
        }
      }
    }

    if (!selectedBettingOption)
      return;
    let takerOrder: any = {
      salt: `${generateRandomSalt()}`,
      maker: correspondingAddress as `0x${string}`,
      signer: signerAddress || publicAddress as `0x${string}`,
      taker: `0x0000000000000000000000000000000000000000`,
      tokenId: ((showNo ? selectedBettingOption.noTokenId : selectedBettingOption.yesTokenId) || '').toString(),
      makerAmount: parseUnits(`${buyOrSell == BUY ? Math.ceil(collateralAmount * 1000000) / 1000000 : Math.ceil(conditionalTokenAmount * 1000000) / 1000000}`, 6).toString(),
      takerAmount: parseUnits(`${buyOrSell == BUY ? Math.floor(conditionalTokenAmount * 1000000) / 1000000 : Math.floor(collateralAmount * 1000000) / 1000000}`, 6).toString(),
      expiration: '0',
      nonce: '0',
      feeRateBps: '0',
      side: `${Number(!buyOrSell)}`,
      signatureType: '0'
    };

    const domainType = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    const orderType = [
      { name: 'salt', type: 'uint256' },
      { name: 'maker', type: 'address' },
      { name: 'signer', type: 'address' },
      { name: 'taker', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'makerAmount', type: 'uint256' },
      { name: 'takerAmount', type: 'uint256' },
      { name: 'expiration', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'feeRateBps', type: 'uint256' },
      { name: 'side', type: 'uint8' },
      { name: 'signatureType', type: 'uint8' }
    ];

    const domain: any = {
      name: 'PLSpeak CTF Exchange',
      version: '1',
      chainId: 943,
      verifyingContract: CTFExchangeContract.address
    }

    takerOrder.signature = await signTypedDataAsync({
      types: {
        EIP712Domain: domainType,
        Order: orderType
      },
      domain: domain,
      primaryType: 'Order',
      message: takerOrder
    });
    takerOrder.bettingStyle = bettingStyle;
    takerOrder.shares = takerOrder.side == 0 ? takerOrder.takerAmount : takerOrder.makerAmount;

    const headers = { Authorization: `Bearer ${accessToken}` };

    // show waiting...
    setIsProgressing(true);

    try {
      await apis.OrderMatch({ takerOrder, makerOrders, takerFillAmount, makerFillAmounts })
    } catch (err) {
      console.error(err);
    }
    // hide waiting...
    setIsProgressing(false);
  }

  const onYesButtonClicked = () => {
    dispatch(setShowNo(false));
  }

  const onNoButtonClicked = () => {
    dispatch(setShowNo(true));
  }

  const switchToChain = async (chainId: any) => {
    try {
      await switchChain(config, { chainId })
    } catch (error) {
      console.error('Error switching chain:', error);
    }
  };

  React.useEffect(() => {
    // if (!orders || !orders.length) return;
    let _yesOrders = orders.map(order => {
      const { tokenId, makerAmount, takerAmount, status, side, bettingStyle, ...rest } = order;
      let price = side == 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount;

      if (tokenId == selectedBettingOption?.yesTokenId) return {
        price,
        side,
        ...rest
      }
      else return {
        price: 100 - price,
        side: 1 - side,
        ...rest
      }
    });

    let _orders = _yesOrders;
    if (showNo) {
      _orders = _orders.map(order => {
        const { price, side, ...rest } = order;
        return {
          price: 100 - price,
          side: 1 - side,
          ...rest
        }
      })
    }

    const sellOrders = mergeElements(_orders.filter(order => order.side == 1).sort((a, b) => a.price - b.price));

    let predictedShares = 0;
    let remain = Number(amount) * 1000000;
    let avgValue = 100;

    if (remain == 0) {
      avgValue = 0;
      predictedShares = 0;
    }
    else if (sellOrders.length > 0) {
      for (let i = 0; i < sellOrders.length; i++) {
        let order = sellOrders[i];
        if (remain >= order.price * order.shares / 100) {
          predictedShares += order.shares;
          remain -= order.price * order.shares / 100;
        } else {
          // if have no sufficient money to get all, so need to get some parts only
          predictedShares += remain * 100 / order.price;
          remain = 0;
          break;
        }
      }
      if (remain == 0) {
        avgValue = Number(amount) * 1000000 * 100 / predictedShares;
      }
    } else {
      avgValue = 100;
      predictedShares = 0;
    }
    setPredictedShares(Number(formatUnits(Math.floor(predictedShares), 6)));
    setAvgValue(avgValue);
  }, [amount]);

  React.useEffect(() => {
    // if (!orders || !orders.length) return;
    let _yesOrders = orders.map(order => {
      const { tokenId, makerAmount, takerAmount, status, side, bettingStyle, ...rest } = order;
      let price = side == 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount;

      if (tokenId == selectedBettingOption?.yesTokenId) return {
        price,
        side,
        ...rest
      }
      else return {
        price: 100 - price,
        side: 1 - side,
        ...rest
      }
    });

    let _orders = _yesOrders;
    if (showNo) {
      _orders = _orders.map(order => {
        const { price, side, ...rest } = order;
        return {
          price: 100 - price,
          side: 1 - side,
          ...rest
        }
      })
    }

    const buyOrders = mergeElements(_orders.filter(order => order.side == 0).sort((a, b) => b.price - a.price));
    let remainingShares = Number(shares) * 1000000;
    let amountReceived = 0;
    let avgValue = 0;

    if (buyOrders.length > 0) {
      for (let i = 0; i < buyOrders.length; i++) {
        let order = buyOrders[i];
        if (remainingShares >= order.shares) {
          amountReceived += order.shares * order.price;
          remainingShares -= order.shares;
        } else {
          amountReceived += remainingShares * order.price;
          remainingShares = 0;
          break;
        }
      }
      if (remainingShares == 0) {
        avgValue = amountReceived / Number(shares);
      }
    } else {
      avgValue = 0;
      amountReceived = 0;
    }

    setAvgValue(avgValue);
    setEstimatedAmountReceived(amountReceived / 1000000);
  }, [shares]);

  React.useEffect(() => {
    if (!orders || !orders.length) {
      setYesValue(50);
      setNoValue(50);
      return;
    }

    let _yesOrders = orders.map(order => {
      const { tokenId, makerAmount, takerAmount, status, side, bettingStyle, ...rest } = order;
      let price = side == 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount;

      if (tokenId == selectedBettingOption?.yesTokenId) return {
        price,
        side,
        ...rest
      }
      else return {
        price: 100 - price,
        side: 1 - side,
        ...rest
      }
    });

    const sellOrders = _yesOrders.filter(order => order.side == 1).sort((a, b) => a.price - b.price);
    const buyOrders = _yesOrders.filter(order => order.side == 0).sort((a, b) => b.price - a.price);

    if (buyOrders.length > 0)
      setNoValue(100 - buyOrders[0].price);
    else
      setNoValue(50);
    if (sellOrders.length > 0)
      setYesValue(sellOrders[0].price);
    else
      setYesValue(50);
  }, [orders]);

  React.useEffect(() => {
    if (bettingStyle === BettingStyle.Market && buyOrSell === BUY) {
      setInsufficientBalance(amount > currentMoney)
    } else if (bettingStyle === BettingStyle.Limit && buyOrSell === BUY) {
      setInsufficientBalance(limitPrice / 100.0 * shares > currentMoney)
    }
    if (buyOrSell === SELL) {
      setInsufficientBalance(shares > (showNo ? noShares : yesShares))
    }
  }, [buyOrSell, bettingStyle, amount, currentMoney, limitPrice, shares, showNo, noShares, yesShares])


  const Content = () => (
    <div style={{ margin: "20px 25px 0px 25px" }}>
      <Flex align="center" justify="space-between">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Outcome
        </Typography.Title>
        <Flex>
          <Button type="text" icon={<RedoOutlined />} onClick={refreshOrders} />
        </Flex>
      </Flex>
      <Flex justify="space-between" style={{ marginTop: 10 }}>
        <Flex vertical align="center" justify="center" gap={5}>
          <Button type="primary" size="large" style={{ width: 140 }} onClick={() => onYesButtonClicked()}>
            Yes {roundToTwo(yesValue)}¢
          </Button>
          <Typography.Title level={5} style={{ margin: 0, color: colors.pink }}>
            {roundToTwo(yesShares)} Shares
          </Typography.Title>
        </Flex>
        <Flex vertical align="center" justify="center" gap={5}>
          <Button size="large" style={{ width: 140, backgroundColor: "black" }} onClick={() => onNoButtonClicked()}>
            No {roundToTwo(noValue)}¢
          </Button>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {roundToTwo(noShares)} Shares
          </Typography.Title>
        </Flex>
      </Flex>
      {
        bettingStyle === BettingStyle.Market ?
          <>
            <Flex vertical gap={10}>
              {tab === "BUY" ?
                <>
                  <Flex align="center" justify="space-between">
                    <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
                      Amount($)
                    </Typography.Title>
                    <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
                      Balance: {roundToTwo(currentMoney)}
                    </Typography.Title>
                  </Flex>
                  <Input
                    size="large"
                    ref={ref}
                    addonBefore={
                      <Button
                        type="text"
                        icon={<MinusOutlined />}
                        onClick={() => {
                          if (amount > 0)
                            setAmount(amount - 10)
                        }}
                        style={{ margin: 0 }}
                      />
                    }
                    addonAfter={
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setAmount(amount + 10)
                        }}
                        style={{ margin: 0 }}
                      />
                    }
                    value={amount}
                    style={{
                      textAlign: "center",
                    }}
                  />
                  {insufficientBalance ? <Typography.Title level={5} style={{ color: 'red', margin: 0, textAlign: 'center' }}>Insufficient balance</Typography.Title> : null}
                </>
                :
                <>
                  <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
                    Shares
                  </Typography.Title>
                  <Input
                    size="large"
                    ref={ref}
                    addonBefore={
                      <Button
                        type="text"
                        icon={<MinusOutlined />}
                        onClick={() => {
                          if (shares > 0)
                            setShares(shares - 10)
                        }}
                        style={{ margin: 0 }}
                      />
                    }
                    addonAfter={
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setShares(shares + 10)
                        }}
                        style={{ margin: 0 }}
                      />
                    }
                    value={shares}
                    style={{
                      textAlign: "center",
                    }}
                  />
                  {insufficientBalance ? <Typography.Title level={5} style={{ color: 'red', margin: 0, textAlign: 'center' }}>Insufficient balance</Typography.Title> : null}
                </>
              }
            </Flex>
            {(accessToken != undefined && accessToken !== '') ? chainId == pulsechainV4.id ?
              <Button
                disabled={isProgressing || (buyOrSell == BUY && (amount > currentMoney)) || (buyOrSell == SELL && (shares > (showNo ? noShares : yesShares)))}
                style={{
                  backgroundColor: '#1652f0', color: 'white', width: '100%', marginTop: 20
                }}
                size="large"
                onClick={handleBuySellClick}
              >
                {buyOrSell === BUY ? 'Buy' : 'Sell'}
              </Button>
              :
              <Button
                color="primary"
                size="large"
                onClick={() => switchToChain(pulsechainV4.id)}
              >
                Switch Network
              </Button>
              :
              <Button
                type="primary"
                size="large"
                style={{ marginTop: 20, width: '100%' }}
                onClick={() => store.dispatch(setOpenLoginModal(true))}
              >
                Log In
              </Button>
            }
            {isProgressing && (
              <Spin size="large" />
            )}
            <Flex vertical style={{ marginTop: 20 }}>
              <Flex justify="space-between">
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Avg Price
                </Typography.Title>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {roundToTwo(avgValue)}¢
                </Typography.Title>
              </Flex>
              {
                tab === "BUY" ?
                  <>
                    <Flex justify="space-between">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        Shares
                      </Typography.Title>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {roundToTwo(predictedShares)}
                      </Typography.Title>
                    </Flex>
                    <Flex justify="space-between">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        Potential Return
                      </Typography.Title>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        ${roundToTwo(predictedShares)}({avgValue == 0 ? 0 : roundToTwo((100 / avgValue - 1) * 100)}%)
                      </Typography.Title>
                    </Flex>
                  </>
                  :
                  <Flex justify="space-between">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Est. Amount Received
                    </Typography.Title>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      ${roundToTwo(estimatedAmountReceived)}
                    </Typography.Title>
                  </Flex>
              }
            </Flex>
          </>
          :
          <>
            <Flex align="center" justify="space-between">
              <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
                Limit Price
              </Typography.Title>
              {
                tab === "BUY" ?
                  <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
                    Balance: {roundToTwo(currentMoney)}
                  </Typography.Title>
                  : null
              }
            </Flex>
            <Flex vertical gap={10}>
              <Input
                size="large"
                ref={ref}
                addonBefore={
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={() => {
                      if (limitPrice > 0)
                        setLimitPrice(limitPrice - 1)
                    }}
                    style={{ margin: 0 }}
                  />
                }
                addonAfter={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setLimitPrice(limitPrice + 1)
                    }}
                    style={{ margin: 0 }}
                  />
                }
                value={limitPrice}
                style={{
                  textAlign: "center",
                }}
              />
            </Flex>
            <Typography.Title level={5} style={{ margin: "20px 0px 10px 0px" }}>
              Shares
            </Typography.Title>
            <Flex vertical gap={10}>
              <Input
                size="large"
                addonBefore={
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={() => {
                      if (shares > 0)
                        setShares(shares - 10)
                    }}
                    style={{ margin: 0 }}
                  />
                }
                addonAfter={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setShares(shares + 10)
                    }}
                    style={{ margin: 0 }}
                  />
                }
                value={shares}
                style={{
                  textAlign: "center",
                }}
              />
              {insufficientBalance ? <Typography.Title level={5} style={{ color: 'red', margin: 0, textAlign: 'center' }}>Insufficient balance</Typography.Title> : null}
              {(accessToken != undefined && accessToken !== '') ? chainId == pulsechainV4.id ?
                <Button
                  disabled={isProgressing || (buyOrSell == BUY && (amount > currentMoney)) || (buyOrSell == SELL && (shares > (showNo ? noShares : yesShares)))}
                  style={{
                    backgroundColor: '#1652f0', color: 'white', width: '100%', marginTop: 10
                  }}
                  size="large"
                  onClick={handleBuySellClick}
                >
                  {buyOrSell === BUY ? 'Buy' : 'Sell'}
                </Button>
                :
                <Button
                  color="primary"
                  size="large"
                  onClick={() => switchToChain(pulsechainV4.id)}
                >
                  Switch Network
                </Button>
                :
                <Button
                  type="primary"
                  size="large"
                  style={{ marginTop: 20 }}
                  onClick={() => store.dispatch(setOpenLoginModal(true))}
                >
                  Log In
                </Button>
              }
            </Flex>
            {isProgressing && (
              <Spin size="large" />
            )}
            <Flex vertical style={{ marginTop: 20 }}>
              <Flex justify="space-between">
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Total
                </Typography.Title>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  ${roundToTwo(Number(shares) * Number(limitPrice) / 100)}
                </Typography.Title>
              </Flex>
              {
                tab === "BUY" ?
                  <Flex justify="space-between">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Potential Return
                    </Typography.Title>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {limitPrice === 0 ? '$0.00 (0.00%)' : `$${roundToTwo(Number(shares))}(${roundToTwo((Number(shares) / (Number(shares) * Number(limitPrice) / 100)) * 100)}%)`}
                    </Typography.Title>
                  </Flex>
                  : null
              }
            </Flex>
          </>
      }
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
      {selectedBettingOption ?
        (
          selectedBettingOption.result === 0 ?
            (
              <Tabs
                activeKey={tab}
                onChange={(key: string) => {
                  setTab(key);
                  if (key === "BUY") {
                    dispatch(setBuyOrSell(BUY))
                  } else if (key === "SELL") {
                    dispatch(setBuyOrSell(SELL))
                  }
                }}
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
                      {bettingStyle}
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
            )
            : null
        )
        :
        <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }}>
          <Spin size="large" />
        </Typography.Title>
      }
    </Card>
  );
};

export default BuySellCard;
