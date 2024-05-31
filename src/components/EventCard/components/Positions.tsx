import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatUnits } from 'ethers';
import { Row, Button, Typography } from "antd";
import { RootState } from "store";
import { PositionInfo } from "types";
import { YES, NO, SELL } from "constant";
import { roundToTwo } from "utils";
import { setShowNo, setBuyOrSell } from "store/slices/orderSlice";

const Positions = () => {
    const { bettingOptionLogs } = useSelector((state: RootState) => state.orderKey);
    const { selectedBettingOption } = useSelector((state: RootState) => state.eventKey);
    const { correspondingAddress } = useSelector((state: RootState) => state.userKey);

    const [positions, setPositions] = useState<PositionInfo[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (bettingOptionLogs.length > 0 && correspondingAddress !== '' && selectedBettingOption?.yesTokenId && selectedBettingOption?.noTokenId) {
            const getTokenPriceFromLastTransaction = (tokenId: string) => {
                for (let i = bettingOptionLogs.length - 1; i >= 0; i--) {
                    let log = bettingOptionLogs[i];
                    if (log.makerAssetId === tokenId) {
                        return Number(log.takerAmountFilled) * 100 / Number(log.makerAmountFilled);
                    } else if (log.takerAssetId === tokenId) {
                        return Number(log.makerAmountFilled) * 100 / Number(log.takerAmountFilled);
                    }
                }
                return 0;
            }

            let logs = bettingOptionLogs.filter(log => {
                return log.maker === correspondingAddress;
            })
            if (logs.length === 0) {
                setPositions([]);
                return;
            }
            let positions = [
                {
                    shares: 0,
                    earnedShares: 0,
                    spentMoney: 0,
                    currentPrice: 0
                },
                {
                    shares: 0,
                    earnedShares: 0,
                    spentMoney: 0,
                    currentPrice: 0
                }
            ];
            positions[Number(YES)].currentPrice = getTokenPriceFromLastTransaction(selectedBettingOption.yesTokenId);
            positions[Number(NO)].currentPrice = getTokenPriceFromLastTransaction(selectedBettingOption.noTokenId);

            for (let i = 0; i < logs.length; i++) {
                let log = logs[i];

                let indexInPositions = log.makerAssetId === selectedBettingOption.yesTokenId || log.takerAssetId === selectedBettingOption.yesTokenId ? Number(YES) : Number(NO);

                if (log.makerAssetId === '0') { // collateral pay
                    positions[indexInPositions].spentMoney += Number(log.makerAmountFilled);
                    positions[indexInPositions].earnedShares += Number(log.takerAmountFilled);
                    positions[indexInPositions].shares += Number(log.takerAmountFilled);
                } else {
                    positions[indexInPositions].shares -= Number(log.makerAmountFilled);
                }
            }
            setPositions(positions);
        } else {
            setPositions([]);
        }
    }, [bettingOptionLogs, selectedBettingOption, correspondingAddress]);

    return positions.length > 0 ? (
        <>
            <h1>Positions</h1>
            <table width="100%" style={{ textAlign: "right" }}>
                <thead>
                    <tr>
                        <th>Outcome</th>
                        <th>Shares</th>
                        <th>AVG</th>
                        <th>Value</th>
                        <th>Total Return</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((position: PositionInfo, index: number) => {
                        return position.shares > 0 && position.earnedShares > 0 ? (
                            <tr key={index}>
                                <td>{index === Number(YES) ? 'Yes' : 'No'}</td>
                                <td>{roundToTwo(Number(formatUnits(`${position.shares}`, 6)))}</td>
                                <td>{roundToTwo(position.spentMoney * 100 / position.earnedShares)}c</td>
                                <td>${roundToTwo(Number(formatUnits(`${position.shares}`, 6)) * position.currentPrice / 100)}</td>
                                <td>
                                    <Row>
                                        {(roundToTwo(position.currentPrice / 100 - position.spentMoney / position.earnedShares) < 0) && (<>-</>)}${roundToTwo(Number(formatUnits(Math.floor(Math.abs(position.shares * (position.currentPrice / 100 - position.spentMoney / position.earnedShares))), 6)))}
                                        <Typography.Title level={5} style={{ margin: 0, color: roundToTwo(position.currentPrice / 100 - position.spentMoney / position.earnedShares) < 0 ? 'red' : 'green' }}>
                                            ({roundToTwo((position.currentPrice / 100 - position.spentMoney / position.earnedShares) * 100 / (position.spentMoney / position.earnedShares))}%)
                                        </Typography.Title>
                                    </Row>
                                </td>
                                <td>
                                    <Button onClick={() => { dispatch(setShowNo(index === Number(NO))); dispatch(setBuyOrSell(SELL)) }}>Sell</Button>
                                </td>
                            </tr>
                        ) : (null)
                    })}
                </tbody>
            </table>
        </>
    ) : null;
};

export default Positions;