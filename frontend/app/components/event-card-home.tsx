import type { Event } from "~/interfaces/event";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";
import { Calendar, MapPinned, ScanQrCode, Users } from "lucide-react";
import { dateToString } from "~/lib/date-format";

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
    <Card className="w-full max-w-sm bg-white gap-1">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 py-2">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Calendar size={"1rem"} /> {eventDate}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Users size={"1rem"} /> {organizationName}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <MapPinned size={"1rem"} /> {eventLocation}
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2 mt-auto">
        <Link to={`/event/${event.id}/scan`} className="w-full">
          <Button variant="default" className="w-full">
            <ScanQrCode /> Scan QR Code
          </Button>
        </Link>
        <Link to={`/event/${event.id}/attendees`} className="w-full">
          <Button variant="neutral" className="w-full">
            Daftar Hadir
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
