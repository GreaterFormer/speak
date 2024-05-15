import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Flex } from "antd";
import BuySellCard from "components/BuySellCard";
import EventCard from "components/EventCard";
import { getBettingOptionsPromise } from "utils";

const Event = () => {
    const { ipfsUrl } = useParams();
    const [eventInfo, setEventInfo] = React.useState<any>(null);

    const getEventInfo = async () => {
        try {
            let item: any = {
                ipfsUrl
            };

            const response: any = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsUrl}`);
            const { data } = response;
            item.title = data.title;
            item.detail = data.detail;
            item.image = data.image;
            item.category = data.category;
            item.endDate = data.endDate;

            getBettingOptionsPromise(data)
                .then(bettingOptions => {
                    item.bettingOptions = bettingOptions;
                    setEventInfo(item);
                })
        } catch (err: any) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        if (ipfsUrl) {
            getEventInfo();
        }
    }, [ipfsUrl]);

    // console.log(eventInfo);

    return (
        <div style={{ maxWidth: 1200, width: "100%", margin: "0px auto" }}>
            <Flex gap={20}>
                <EventCard eventInfo={eventInfo} />
                <BuySellCard />
            </Flex>
        </div>
    )
}

export default Event;