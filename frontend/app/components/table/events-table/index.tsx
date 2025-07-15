import { useEffect, useState } from "react";

import { type Event } from "~/interfaces/event";
import { EventService } from "~/services/event.service";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { CreateEventForm, EditEventForm } from "../../form/event-form";

type Props = {
  organizationId: number;
};

export const EventsTable = ({ organizationId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
      setEvents([]);
    }
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

  return (
    <>
      <Button onClick={() => {}}>Tambah acara</Button>
      <div>
        <InputText placeholder="Cari acara..." />
      </div>
      <Dialog
        visible={showCreateForm}
        onHide={() => setShowCreateForm(false)}
        header="Buat acara baru"
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
      >
        <EditEventForm
          eventId={selectedEventId}
          organizationId={organizationId}
          onUpdate={onEventUpdated}
          onDelete={onEventDelete}
        />
      </Dialog>
    </>
  );
};
