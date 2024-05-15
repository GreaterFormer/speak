import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Card, Flex, Typography, Avatar } from "antd";
import { PublishedEventInfo } from "types";
import { MessageOutlined, StarOutlined } from '@ant-design/icons';


function BettingOptionPrices({ ipfsUrl }: { ipfsUrl: string }) {
    const [yesPrice, setYesPrice] = useState(50);
    useEffect(() => {
        if (ipfsUrl) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/orders/price/${ipfsUrl}`)
                .then((response) => {
                    if (response.status != 200) {
                        throw new Error('Error happened')
                    } else {
                        return response.json()
                    }
                })
                // If yes, retrieve it. If no, create it.
                .then((res) => {
                    setYesPrice(res.yesPrice);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [ipfsUrl])

    return (
        <>
            <Flex style={{ background: 'rgba(39, 174, 96, 0.1)', width: `${yesPrice}%`, display: 'flex', justifyContent: 'left' }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Yes {yesPrice} %</Typography>
            </Flex>
            <Flex style={{ background: 'rgba(235, 87, 87, 0.1)', width: `${100 - yesPrice}%`, display: 'flex', justifyContent: 'right' }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>No {100 - yesPrice} %</Typography>
            </Flex>
        </>
    )

}

const PublishedEvent = ({ event }: { event: PublishedEventInfo }) => {

    let total = 0;
    let resolved = true;
    for (let i = 0; i < event.bettingOptions.length; i++) {
        total += event.bettingOptions[i].bet;
        if (event.bettingOptions[i].result == 0) resolved = false;
    }

    const renderBettingOptions = () => {
        if (resolved == false) {
            if (event.bettingOptions.length == 1) {
                return (
                    <Flex style={{ height: 32, width: '100%', marginTop: 20, gap: 0.125, display: 'flex' }}>
                        <BettingOptionPrices ipfsUrl={event.bettingOptions[0].ipfsUrl} />
                    </Flex>
                )
            } else {
                return (
                    <Flex style={{ height: '90px', overflowY: 'hidden', WebkitMaskImage: 'linear-gradient(white 65%, transparent 100%)' }} >
                        {event.bettingOptions.map((bettingOption, index) => {
                            return (
                                <Flex style={{ display: 'flex', marginTop: 0.5, justifyContent: 'space-between' }} key={index}>
                                    <Flex style={{ display: 'flex', gap: '0.5rem' }}>
                                        {bettingOption.image ? (
                                            <Avatar
                                                shape="square"
                                                size={72}
                                                src={`https://gateway.pinata.cloud/ipfs/${event.image}`}
                                            />) : null}
                                        <Typography style={{ padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                                            {bettingOption.title}
                                        </Typography>

                                    </Flex>
                                    <Flex style={{ width: '140px', gap: 0.125, display: 'flex' }}>
                                        <BettingOptionPrices ipfsUrl={bettingOption.ipfsUrl} />
                                    </Flex>
                                </Flex>
                            )
                        })}
                    </Flex>
                )
            }
        } else {
            if (event.bettingOptions.length == 1) {
                // how to get
                let yes_or_no = event.bettingOptions[0].result;

                return (
                    <Flex style={{ height: 32, width: 1 }}>
                        {yes_or_no == 1 ? (
                            <Flex style={{ background: 'rgba(39, 174, 96, 0.1)', width: 1, display: 'flex', justifyContent: 'left' }}>
                                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Resolved: Yes</Typography>
                            </Flex>
                        ) : (
                            <Flex style={{ background: 'rgba(235, 87, 87, 0.1)', width: 1, display: 'flex', justifyContent: 'right' }}>
                                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Resolved: No</Typography>
                            </Flex>
                        )}
                    </Flex>
                )
            } else {

                return (
                    <Flex style={{ height: '80px', overflowY: 'hidden', WebkitMaskImage: 'linear-gradient(white 65%, transparent 100%)' }} >
                        {event.bettingOptions.map((bettingOption, index) => {
                            let yes_or_no = bettingOption.result;

                            return (
                                <Flex style={{ display: 'flex', marginTop: 0.5, justifyContent: 'space-between' }} key={index}>
                                    <Flex style={{ display: 'flex', gap: '0.5rem' }}>
                                        {bettingOption.image ? (
                                            <Avatar
                                                shape="square"
                                                size={72}
                                                src={`https://gateway.pinata.cloud/ipfs/${event.image}`}
                                            />
                                        ) : null}
                                        <Typography style={{ padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                            {bettingOption.title}
                                        </Typography>

                                    </Flex>
                                    <Flex style={{ width: '140px', gap: 0.125, display: 'flex' }}>
                                        {yes_or_no == 1 ? (
                                            <Flex style={{ background: 'rgba(39, 174, 96, 0.1)', width: 1, display: 'flex', justifyContent: 'left', overflow: 'hidden' }}>
                                                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Resolved: Yes</Typography>
                                            </Flex>
                                        ) : (
                                            <Flex style={{ background: 'rgba(235, 87, 87, 0.1)', width: 1, display: 'flex', justifyContent: 'left', overflow: 'hidden' }}>
                                                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Resolved: No</Typography>
                                            </Flex>
                                        )}
                                    </Flex>
                                </Flex>
                            )
                        })}
                    </Flex>
                )
            }
        }
    };

    return (

        <Card style={{ height: 200, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', "&:hover": { FlexShadow: 8 } }}>
            <Flex style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <Avatar
                    shape="square"
                    size={72}
                    src={`https://gateway.pinata.cloud/ipfs/${event.image}`}
                />
                <Flex vertical align="flex-end" style={{ padding: 0.6, marginLeft: 10 }}>
                    <Typography style={{ color: 'lightgray', fontSize: 12 }}>
                        {event.category}
                    </Typography>
                    <Typography style={{ fontSize: 18 }}>
                        <Link to={`/events/${event.ipfsUrl}`} style={{ textDecoration: 'none' }}>{event.title}</Link>
                    </Typography>
                </Flex>
            </Flex>
            {renderBettingOptions()}
            <Flex style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Typography>
                    ${total} Bet
                </Typography>

                <Flex style={{ display: 'flex', gap: '0.25rem' }}>
                    <MessageOutlined />
                    <Typography style={{ marginRight: 5 }}>
                        {event.comments ? event.comments.length : 0}
                    </Typography>
                    <StarOutlined />
                </Flex>
            </Flex>
        </Card>
    )
}

export default PublishedEvent;