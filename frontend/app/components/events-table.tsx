import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Event } from "~/interfaces/event";
import { dateToString } from "~/lib/date-format";
import { EventService } from "~/services/event.service";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { EventForm } from "./event-form";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  organizationId: number;
};

export const EventsTable = ({ organizationId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!organizationId) {
        setEvents([]);
        return;
      }
      try {
        const res = await EventService.getUpcomingEventsByOrganization(
          organizationId
        );
        const events: Event[] = res.data.data;
        setEvents(events);
      } catch (error) {
        toast.error("Error getting events");
        setEvents([]);
      }
    };

    fetchEvents();
  }, [organizationId]);

  return (
    <div className="flex flex-col gap-2 items-start">
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="bg-blue-200" onClick={() => {}} size={"sm"}>
            Tambah acara
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat acara baru</DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>

      <Table className="border">
        <TableHeader>
          <TableRow className="bg-blue-500 hover:bg-blue-500">
            <TableHead>Nama</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((event: Event) => (
            <TableRow key={event.id} className="bg-blue-200 hover:bg-blue-300">
              <TableCell className="font-base">{event.name}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{dateToString(event.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
