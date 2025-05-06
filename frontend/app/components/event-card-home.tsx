import type { Event } from "~/interfaces/event";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { RiQrCodeLine } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { Link } from "react-router";

type Props = {
  event: Event;
};

export function EventCardHome({ event }: Props) {
  return (
    <Card className="w-full max-w-sm bg-white gap-1">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="gap-3 py-2">
        <p>{event.description}</p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <GrMapLocation /> {event.location ?? "-"}
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link to={`/event/${event.id}/scan`} className="w-full">
          <Button variant="default" className="w-full">
            <RiQrCodeLine /> Scan QR Code
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
