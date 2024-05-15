import { Layout } from "antd";
import AppHeader from "./Header";

import CoastToken from "artifacts/contracts/papaya/CST.json"
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';
import { JwtDecoded } from 'types';
import { jwtDecode } from 'jwt-decode';
import { formatUnits } from 'ethers';
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from 'store/slices/userSlice';
import { RootState } from 'store';
import socket from "utils/socket";
import { createOrder, removeOrder, updateOrder } from 'store/slices/orderSlice';
import { pulsechainV4 } from 'viem/chains';
import { useWatchContractEvent } from 'wagmi';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [accessToken] = useLocalStorage<string>('accessToken', '')
  const [_, setCurrentMoney] = useLocalStorage<number>('currentMoney', 0)
  let previousToken = '';

  const { correspondingAddress } = useSelector((state: RootState) => state.userKey);
  const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);

  const fetchBalance = (address: string) => {
    if (address && address != '') {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/contract/balance/${address}`)
        .then((response) => response.json())
        .then(({ balance, decimals }) => {
          setCurrentMoney(Number(formatUnits(balance, Number(decimals))));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCurrentMoney(0);
    }
  }

  useEffect(() => {
    if (accessToken == undefined || accessToken == '') {
      dispatch(setUserInfo({ id: '', publicAddress: '', correspondingAddress: '', isAdmin: false }));
    }
    else if (accessToken != '' && accessToken != previousToken) {
      previousToken = accessToken;
      const {
        payload: {
          id,
          publicAddress,
          correspondingAddress,
          isAdmin
        }
      } = jwtDecode<JwtDecoded>(accessToken)
      dispatch(setUserInfo({ id, publicAddress, correspondingAddress, isAdmin }));
    }
  }, [accessToken])

  const onOrderCreated = (data: any) => {
    if (data.tokenId == selectedBettingOption?.yesTokenId || data.tokenId == selectedBettingOption?.noTokenId)
      dispatch(createOrder(data));
    console.log(`Order Created....`)
  }

  const onOrderUpdated = (data: any) => {
    if (data.tokenId == selectedBettingOption?.yesTokenId || data.tokenId == selectedBettingOption?.noTokenId)
      dispatch(updateOrder(data));
    console.log(`Order Updated....`)
  }

  const onOrderRemoved = (data: any) => {
    if (data.tokenId == selectedBettingOption?.yesTokenId || data.tokenId == selectedBettingOption?.noTokenId)
      dispatch(removeOrder(data));
    console.log(`Order Deleted....`)
  }

  useEffect(() => {
    if (socket) {
      socket.on('Order created', onOrderCreated);
      socket.on('Order updated', onOrderUpdated);
      socket.on('Order deleted', onOrderRemoved);
    }
    return () => {
      socket.off('Order created', onOrderCreated);
      socket.off('Order updated', onOrderUpdated);
      socket.off('Order deleted', onOrderRemoved);
    }
  }, [socket, selectedBettingOption]);

  useEffect(() => {
    fetchBalance(correspondingAddress)
  }, [correspondingAddress])

  useWatchContractEvent({
    address: CoastToken.address as `0x${string}`,
    abi: CoastToken.abi,
    eventName: 'Transfer',
    chainId: pulsechainV4.id,
    onLogs(logs: any) {
      try {
        const { from, to } = (logs[0] as any).args;
        if (from.toLowerCase() == correspondingAddress.toLowerCase() || to.toLowerCase() == correspondingAddress.toLowerCase()) {
          fetchBalance(correspondingAddress)
        }
      } catch (err) {
        console.log(err);
      }
    }
  })

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
