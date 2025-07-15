import type { Event } from "~/interfaces/event";
import { Calendar, MapPinned, ScanQrCode, Users } from "lucide-react";
import { dateToString } from "~/lib/date-format";
import { Card } from "primereact/card";
import { Link } from "react-router";
import { Button } from "primereact/button";

type Props = {
  event: Event;
};

export function EventCardHome({ event }: Props) {
  const organizationName = event.Organization?.name ?? "-";
  const eventLocation = event.location ?? "-";
  const eventDate = dateToString(event.date);

  const today = new Date();
  const isToday = new Date(event.date).getDate() === today.getDate();

  return (
    <Card title={event.name}>
      <div>
        <p>
          <Calendar size={"1rem"} /> {eventDate}
        </p>
        <p>
          <Users size={"1rem"} /> {organizationName}
        </p>
        <p>
          <MapPinned size={"1rem"} /> {eventLocation}
        </p>
      </div>
      <div>
        <Link to={`/scanner/${event.id}`}>
          <Button>
            <ScanQrCode /> Scan QR Code
          </Button>
        </Link>
        <Link to={`/event/${event.id}/attendees`}>
          <Button>Daftar Hadir</Button>
        </Link>
      </div>
    </Card>
  );
}
