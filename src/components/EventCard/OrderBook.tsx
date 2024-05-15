import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { BUY, SELL, mergeElements, roundToTwo } from '../../constant';
import { setShowNo } from '../../store/slices/orderSlice';
import { formatUnits } from 'ethers';

import { Row, Tabs } from 'antd';
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { RootState } from '../../store';

/*
    orderbook must show the current event's orders.
    when user click buy, need to make order.
*/

function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Row style={{ padding: 3, flexDirection: 'column' }}>
                    {children}
                </Row>
            )}
        </div>
    );
}

export default function OrderBook() {
    const dispatch = useDispatch();
    const [tabKey, setTabKey] = useState("yes");
    const { orders, showNo } = useSelector((state: RootState) => state.orderKey);
    const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);
    const [buyOrders, setBuyOrders] = useState<any[]>([]);
    const [sellOrders, setSellOrders] = useState<any[]>([]);
    const [spread, setSpread] = useState(0);

    useEffect(() => {
        console.log(`orders redrawing`)
        if (!orders || !orders.length) {
            setBuyOrders([]);
            setSellOrders([]);
            return;
        }
        let _yesOrders = orders.map(order => {
            const { tokenId, makerAmount, takerAmount, status, side, bettingStyle, ...rest } = order;
            let price = (side == 0 ? makerAmount * 100 / takerAmount : takerAmount * 100 / makerAmount);


            if (tokenId == selectedBettingOption?.yesTokenId)
                return {
                    price,
                    side,
                    ...rest
                }
            else
                return {
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
        setBuyOrders(buyOrders);
        const sellOrders = mergeElements(_orders.filter(order => order.side == 1).sort((a, b) => a.price - b.price));
        setSellOrders(sellOrders);
        if (sellOrders.length > 0 && buyOrders.length > 0) {
            const spread = sellOrders.at(-1).price - buyOrders[0].price;
            setSpread(spread);
        } else {
            setSpread(0);
        }
    }, [orders, showNo]);

    // const handleChange = (_: any, newValue: number) => {
    //     dispatch(setShowNo(!!newValue));
    // };

    const handleChange = (activeKey: string) => {
        dispatch(setShowNo(activeKey === "yes" ? true : false));
    }

    const renderOrders = ({ orders, isBuy = true }: any) => {
        let previousTotal = 0; // Variable to store the previous orders' total

        orders = orders.map((order: any) => {
            const total = order.price * order.shares + previousTotal; // Calculate the total
            previousTotal = total; // Update the previousTotal for the next iteration

            return (
                <tr key={order._id}>
                    <td>{roundToTwo(order.price)}c</td>
                    <td>{roundToTwo(Number(formatUnits(order.shares, 6)))}</td>
                    <td>${roundToTwo(Number(formatUnits(Math.floor(total / 100), 6)))}</td>
                </tr>
            );
        });
        if (!isBuy) {
            orders = orders.reverse();
        }
        return orders;
    };

    return (
        <Row style={{ width: '100%', flexDirection: 'column' }}>
            <Row style={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs defaultActiveKey={tabKey} onChange={handleChange} type="card"
                    items={[
                        { label: "Trade Yes", key: "yes", children: <></>, icon: <RiseOutlined /> },
                        { label: "Trade No", key: "no", children: <></>, icon: <FallOutlined /> }
                    ].map((item) => {
                        return {
                            label: item.label,
                            key: item.key,
                            children: item.children,
                            icon: item.icon
                        };
                    })}
                />

            </Row>
            <Row style={{ height: '200px', overflowY: 'scroll', flexDirection: 'column' }}>
                <CustomTabPanel value={(+showNo)} index={0}>
                    <Row style={{ backgroundColor: '#eb5757' }}>
                        <table width="100%" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>price</th>
                                    <th>Share</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderOrders({ orders: sellOrders, isBuy: false })}
                            </tbody>
                        </table>
                    </Row>

                    <hr />
                    <div >
                        <div>Spread: {roundToTwo(spread)}c</div>
                    </div>
                    <hr />
                    <Row style={{ backgroundColor: '#27ae60' }}>
                        <table width="100%" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>price</th>
                                    <th>Share</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderOrders({ orders: buyOrders })}
                            </tbody>
                        </table>
                    </Row>
                </CustomTabPanel>
                <CustomTabPanel value={(+showNo)} index={1}>
                    <Row style={{ backgroundColor: '#eb5757' }}>
                        <table width="100%" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>price</th>
                                    <th>Share</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderOrders({ orders: sellOrders, isBuy: false })}
                            </tbody>
                        </table>
                    </Row>

                    <hr />
                    <div >
                        <div>Spread: {roundToTwo(spread)}c</div>
                    </div>
                    <hr />
                    <Row style={{ backgroundColor: '#27ae60' }}>
                        <table width="100%" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>price</th>
                                    <th>Share</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderOrders({ orders: buyOrders })}
                            </tbody>
                        </table>
                    </Row>
                </CustomTabPanel>
            </Row>
        </Row >
    );
}