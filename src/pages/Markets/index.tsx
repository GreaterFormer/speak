import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Row, Col } from "antd";
import { apis } from "apis";
import { getBettingOptionsPromise } from "utils";
import { PublishedEventInfo } from "types";
import { updatePublishedEvent } from "store/slices/eventSlice";
import { RootState } from "store";
import PublishedEvent from "components/PublishedEvent";

const Markets = () => {
    const dispatch = useDispatch();
    // const filter = useSelector((state: RootState) => state.filterKey);
    // const activeCategories = useSelector((state: RootState) => state.categoryKey.activeList);
    const { publishedEvents } = useSelector((state: RootState) => state.eventKey);
    const [events, setEvents] = React.useState<PublishedEventInfo[]>([]);
    const today = new Date();

    React.useEffect(() => {
        const getEvents = async () => {
            try {
                const response: any = await apis.GetEvents();
                response.eventUrls.forEach(async (ipfsUrl: string, indexInArray: number) => {
                    let item: any = {
                        ipfsUrl, indexInArray
                    };

                    const res: any = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsUrl}`);
                    const { data } = res;
                    item.title = data.title;
                    item.detail = data.detail;
                    item.image = data.image;
                    item.category = data.category;
                    item.endDate = data.endDate;
                    getBettingOptionsPromise(data)
                        .then(bettingOptions => {
                            item.bettingOptions = bettingOptions;
                            dispatch(updatePublishedEvent(item as PublishedEventInfo))
                        })
                })
            } catch (err: any) {
                console.log(err);
            }
        }
        getEvents();
    }, []);

    React.useEffect(() => {
        if (publishedEvents && publishedEvents.length > 0) {
            //   let events = filter.Status == 1 ? publishedEvents.filter(event => event.bettingOptions.reduce((resolved, item) => resolved * item.result, 1) == 0) : filter.Status == 2 ? publishedEvents.filter(event => event.bettingOptions.reduce((resolved, item) => resolved * item.result, 1) != 0) : publishedEvents;

            //   events = filter.Volume == 1 ? events.filter(event => event.bettingOptions.reduce((total, item) => total + item.bet, 0) < 10000) : filter.Volume == 2 ? events.filter(event => inRange(event.bettingOptions.reduce((total, item) => total + item.bet, 0), 10000, 50000)) : filter.Volume == 3 ? events.filter(event => inRange(event.bettingOptions.reduce((total, item) => total + item.bet, 0), 50000, 100000)) : filter.Volume == 4 ? events.filter(event => event.bettingOptions.reduce((total, item) => total + item.bet, 0) >= 100000) : events; 

            //   events = filter.EndDate == 1 ? events.filter(event => (new Date(event.endDate)).getDate() == today.getDate()) : filter.EndDate == 2 ? events.filter(event => getWeek(new Date(event.endDate)) == getWeek(today)) : filter.EndDate == 3 ? events.filter(event => (new Date(event.endDate)).getMonth() == today.getMonth()) : events;

            //   events = activeCategories.length > 0 ? events.filter(event => activeCategories.includes(event.category)) : events;

            setEvents(publishedEvents);
        }
    }, [publishedEvents,
        // filter, activeCategories
    ]);

    return (
        <div style={{

        }}>
            <Row>
                {events.map((event: PublishedEventInfo, index: number) => (
                    <Col key={index} span={4} style={{ padding: 10 }}>
                        <PublishedEvent event={event} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Markets;