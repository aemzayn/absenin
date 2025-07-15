import { useEffect, useState } from "react";
import { type Event } from "~/interfaces/event";
import { EventService } from "~/services/event.service";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CreateEventForm, EditEventForm } from "~/components/form/event-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { dateToString } from "~/lib/date-format";
import dayjs from "dayjs";
import { Badge } from "primereact/badge";
import { PencilIcon, PlusIcon } from "lucide-react";
import "./events-table.scss";

type Props = {
  organizationId: number;
};

export const EventsTable = ({ organizationId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const today = dayjs().startOf("date").toDate();

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
      setEvents(
        events.map((event) => ({
          ...event,
          date: new Date(event.date),
        }))
      );
    } catch (error) {
      setEvents([]);
    }
  };

  const actionBodyTemplate = (id: number) => {
    if (id == null) return "";
    return (
      <Button
        size="small"
        icon={<PencilIcon />}
        onClick={() => {
          setSelectedEventId(id);
          setShowEditForm(true);
        }}
      />
    );
  };

  useEffect(() => {
    fetchEvents();
  }, [organizationId]);

  const onEventCreated = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    setShowCreateForm(false);
  };

  const onEventUpdated = (updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setShowEditForm(false);
  };

  const onEventDelete = (deletedId: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== deletedId));
    setShowEditForm(false);
  };

  const statusBodyTemplate = (date: Date) => {
    const hasPassed = date < today;
    if (hasPassed) {
      return <Badge severity={"danger"} content="Sudah berlalu" />;
    }

    const dayDiff = dayjs(date).diff(today, "days");
    if (dayDiff > 0) {
      return <Badge severity={"info"} content={`${dayDiff} lagi`}></Badge>;
    }

    return <Badge severity={"success"} content="Hari ini" />;
  };

  return (
    <div>
      <Button
        onClick={() => {
          setShowCreateForm(true);
        }}
        label="Tambah Acara"
        icon={<PlusIcon />}
        size="small"
        iconPos="right"
      />

      <DataTable value={events} removableSort>
        <Column field="name" header="Nama acara" filter sortable />
        <Column
          field="date"
          header="Tanggal"
          body={(rowData, { field }) => {
            return dateToString(rowData[field]);
          }}
          filter
          sortable
        />
        <Column
          header="Status"
          body={(rowData) => statusBodyTemplate(rowData["date"])}
        />
        <Column body={(rowData) => actionBodyTemplate(rowData["id"])} />
      </DataTable>

      <Dialog
        visible={showCreateForm}
        onHide={() => setShowCreateForm(false)}
        header="Buat acara baru"
        style={{ minWidth: "50vw" }}
      >
        <CreateEventForm
          organizationId={organizationId}
          onCreate={onEventCreated}
        />
      </Dialog>

      <Dialog
        visible={showEditForm}
        onHide={() => setShowEditForm(false)}
        header="Edit acara"
        style={{ minWidth: "50vw" }}
      >
        <EditEventForm
          eventId={selectedEventId}
          organizationId={organizationId}
          onUpdate={onEventUpdated}
          onDelete={onEventDelete}
        />
      </Dialog>
    </div>
  );
};
