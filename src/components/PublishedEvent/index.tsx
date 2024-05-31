import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Flex, Typography, Avatar, Tooltip } from "antd";
import { PublishedEventInfo } from "types";
import { MessageOutlined, StarOutlined, GiftOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';


function SingleBettingOptionPrices({ ipfsUrl }: { ipfsUrl: string }) {
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
            <Typography style={{ padding: '5px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{yesPrice} %</Typography>
            <Flex style={{ background: '#27AE60', paddingLeft: 5, alignItems: 'center', width: `${yesPrice}%`, display: 'flex', justifyContent: 'left', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Yes</Typography>
                <LikeOutlined />
            </Flex>
            <Flex style={{ background: '#E64800', paddingRight: 5, alignItems: 'center', width: `${100 - yesPrice}%`, display: 'flex', justifyContent: 'right', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>No</Typography>
                <DislikeOutlined />
            </Flex>
        </>
    )

}

function MultiBettingOptionPrices({ ipfsUrl }: { ipfsUrl: string }) {
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

    const [yesButtonText, setYesButtonText] = useState('Yes');
    const [noButtonText, setNoButtonText] = useState('No');
    const [yesHover, setYesHover] = useState(false);
    const [noHover, setNoHover] = useState(false);

    return (
        <>
            <Typography style={{ padding: '5px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{yesPrice} %</Typography>
            <Button
                style={{ backgroundColor: yesHover ? '#27AE60' : '#27AE6033', color: yesHover ? '#FFF' : '#27AE60', width: 50 }}
                onMouseEnter={() => {
                    setYesHover(true);
                    setYesButtonText(`${yesPrice}%`)
                }}
                onMouseLeave={() => {
                    setYesHover(false);
                    setYesButtonText('Yes')
                }}
                onClick={() => console.log('12312')} >
                {yesButtonText}
            </Button>
            <Button
                style={{ backgroundColor: noHover ? '#E64800' : '#EB575733', color: noHover ? '#fff' : '#E64800', width: 50 }}
                onMouseEnter={() => {
                    setNoHover(true)
                    setNoButtonText(`${100 - yesPrice}%`)
                }}
                onMouseLeave={() => {
                    setNoHover(false)
                    setNoButtonText('No')
                }}
                onClick={() => console.log('12312')} >
                {noButtonText}
            </Button>

            {/* <Flex style={{ background: 'rgba(39, 174, 96, 0.1)', width: `${yesPrice}%`, display: 'flex', justifyContent: 'left' }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>Yes {yesPrice} %</Typography>
            </Flex>
            <Flex style={{ background: 'rgba(235, 87, 87, 0.1)', width: `${100 - yesPrice}%`, display: 'flex', justifyContent: 'right' }}>
                <Typography style={{ padding: '5px', whiteSpace: 'nowrap' }}>No {100 - yesPrice} %</Typography>
            </Flex> */}
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
                    <Flex style={{ height: 30, width: '100%', gap: 0.125 }}>
                        <SingleBettingOptionPrices ipfsUrl={event.bettingOptions[0].ipfsUrl} />
                    </Flex>
                )
            } else {
                return (
                    <Flex vertical style={{ height: '70px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent', WebkitMaskImage: 'linear-gradient(white 65%, transparent 100%)' }}>
                        {event.bettingOptions.map((bettingOption, index) => {
                            return (
                                <Flex style={{ display: 'flex', marginTop: 2, justifyContent: 'space-between' }} key={index}>
                                    <Flex style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* {bettingOption.image ? (
                                            <Avatar
                                                shape="square"
                                                size={36}
                                                src={`https://gateway.pinata.cloud/ipfs/${event.image}`}
                                            />) : null} */}
                                        <Typography style={{ padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                                            {bettingOption.title}
                                        </Typography>

                                    </Flex>
                                    <Flex style={{ width: '150px', gap: 0.125, display: 'flex', justifyContent: 'space-between' }}>
                                        <MultiBettingOptionPrices ipfsUrl={bettingOption.ipfsUrl} />
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

        <Card
            style={{
                backgroundColor: 'initial', // Set the initial background color
                transition: 'background-color 0.3s ease', // Add a smooth transition effect
                height: 200
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5466'; // Set the background color on hover
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'initial'; // Reset the background color when leaving hover
            }}
        >
            <Flex vertical justify="space-between" style={{ height: 170 }}>
                <Flex>
                    <Avatar
                        shape="square"
                        size={50}
                        src={`https://gateway.pinata.cloud/ipfs/${event.image}`}
                    />
                    <Flex style={{ padding: 0.6, marginLeft: 10 }}>
                        {/* <Typography style={{ color: 'lightgray', fontSize: 12 }}>
                            {event.category}
                        </Typography> */}
                        <Typography style={{ fontSize: 14, fontWeight: 'bold', }}>
                            <Link
                                to={`/events/${event.ipfsUrl}`}
                                style={{
                                    color: 'white',
                                    textDecoration: 'none', // Remove the default underline
                                    borderBottom: '1px solid transparent', // Add a transparent bottom border
                                    transition: 'border-bottom 0.3s ease', // Add a smooth transition effect
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderBottom = '1px solid white';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderBottom = '1px solid transparent';
                                }}
                            >
                                {event.title}
                            </Link>
                        </Typography>
                    </Flex>
                </Flex>
                {renderBettingOptions()}
                <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography style={{ color: '#858D92' }}>
                        ${total} Bet
                    </Typography>
                    <Flex style={{ gap: '0.25rem', color: '#858D92' }}>
                        <Button type="text" icon={<GiftOutlined />} onClick={() => console.log('12312')} style={{ margin: 0 }} />
                        <Button type="text" icon={<MessageOutlined />} onClick={() => console.log('12312')} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                            <Typography style={{ color: '#858D92' }}>
                                {event.comments ? event.comments.length : 0}
                            </Typography>
                        </Button>
                        <Tooltip title="Add to watchlist">
                            <Button type="text" icon={<StarOutlined />} onClick={() => console.log('12312')} style={{ margin: 0 }} />
                        </Tooltip>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}

export default PublishedEvent;