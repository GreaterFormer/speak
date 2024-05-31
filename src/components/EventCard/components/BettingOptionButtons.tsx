import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "store";
import { Flex, Button } from "antd";
import { BettingOptionInfo, OrderInfo } from "types";
import { roundToTwo } from "utils";
import { apis } from "apis";

const BettingOptionButtons = ({ bettingOption }: { bettingOption: BettingOptionInfo }) => {
    const [yesValue, setYesValue] = useState(50);
    const [noValue, setNoValue] = useState(50);
    const { orders } = useSelector((state: RootState) => state.orderKey);

    const BettingOptionFunc = async (url: string) => {
        const response: any = await apis.GetOrders(url);
        let orders = response.orders as OrderInfo[];
        if (!orders || !orders.length) {
            setYesValue(50);
            setNoValue(50);
            return;
        }

        let _yesOrders = orders.map(order => {
            const { tokenId, makerAmount, takerAmount, status, side, bettingStyle, ...rest } = order;
            let price = side === 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount;

            if (tokenId == bettingOption.yesTokenId) return {
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

        const sellOrders = _yesOrders.filter(order => order.side === 1).sort((a, b) => a.price - b.price);
        const buyOrders = _yesOrders.filter(order => order.side === 0).sort((a, b) => b.price - a.price);

        if (buyOrders.length > 0)
            setNoValue(100 - buyOrders[0].price);
        if (sellOrders.length > 0)
            setYesValue(sellOrders[0].price);
    }

    useEffect(() => {
        if (bettingOption && bettingOption.ipfsUrl) {
            BettingOptionFunc(bettingOption.ipfsUrl);
        }
    }, [bettingOption, orders])

    return (
        <Flex gap={10}>
            <Button style={{ backgroundColor: '#27ae601a', color: 'green' }}>Buy Yes {roundToTwo(yesValue)}¢</Button>
            <Button style={{ backgroundColor: '#eb57571a', color: 'red' }}>Buy No {roundToTwo(noValue)}¢</Button>
        </Flex>
    )
};

export default BettingOptionButtons;