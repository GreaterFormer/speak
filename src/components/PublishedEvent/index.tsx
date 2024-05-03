import { Link } from "react-router-dom";
import { Card } from "antd";
import { PublishedEventInfo } from "types";

const PublishedEvent = ({ event }: { event: PublishedEventInfo }) => {
    return (
        <Card><Link to={`/events/${event.ipfsUrl}`}>{event.title}</Link></Card>
    )
}

export default PublishedEvent;