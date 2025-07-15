import { useEffect, useRef, useState } from "react";
import { Form } from "react-router";
import type { Event } from "~/interfaces/event";
import dayjs from "dayjs";
import localize from "dayjs/plugin/localizedFormat";
import { EventService } from "~/services/event.service";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

dayjs.extend(localize);

type Props = {
  organizationId: number;
  eventId?: number | null;
  onUpdate?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
};

export const EditEventForm = ({
  organizationId,
  eventId,
  onUpdate,
  onDelete,
}: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(dayjs().add(1, "day").toDate());

  const formRef = useRef<HTMLFormElement>(null);

  const eventDateFormatted = date ? dayjs(date).format("LL") : undefined;

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!eventId) return;

    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name")! as string;
      const location = formData.get("location") as string;
      const description = formData.get("description") as string;

      const res = await EventService.updateEvent(eventId, {
        name,
        location,
        date: dayjs(date).startOf("day").toDate(),
        description,
        organizationId,
      });

      const newEvent = res.data.data;
      onUpdate?.(newEvent);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventId) return;

    try {
      setSubmitting(true);
      await EventService.deleteEvent(eventId);
      onDelete?.(eventId);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const res = await EventService.getEvent(eventId);
        const event = res.data.data;

        if (formRef.current) {
          const nameInput = formRef.current.querySelector(
            "#name"
          ) as HTMLInputElement;
          const locationInput = formRef.current.querySelector(
            "#location"
          ) as HTMLInputElement;
          const descriptionInput = formRef.current.querySelector(
            "#description"
          ) as HTMLTextAreaElement;

          nameInput.value = event.name;
          locationInput.value = event.location || "";
          descriptionInput.value = event.description || "";
          setDate(new Date(event.date));
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  return (
    <Form onSubmit={handleUpdate} ref={formRef}>
      <div>
        <div>
          <label htmlFor="name">Nama acara</label>
          <InputText
            id="name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={100}
            disabled={submitting}
          />
        </div>

        <div>
          <div>
            <span>Tanggal acara</span>
            {eventDateFormatted && <span>{eventDateFormatted}</span>}
          </div>

          <div>
            <Calendar
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.value ?? null)}
              showIcon
              showButtonBar
              dateFormat="dd/mm/yy"
              placeholder="Pilih tanggal acara"
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="location">Lokasi acara (opsional)</label>
          <InputText
            id="location"
            name="location"
            type="text"
            minLength={3}
            maxLength={255}
            disabled={submitting}
            placeholder="Contoh: Jakarta, Indonesia"
          />
        </div>

        <div>
          <label htmlFor="description">Deskripsi acara (opsional)</label>
          <InputTextarea
            id="description"
            name="description"
            minLength={3}
            maxLength={255}
            placeholder="Deskripsi singkat tentang acara ini"
            disabled={submitting}
          />
        </div>
      </div>

      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? <>Sedang memperbarui acara...</> : "Update acara"}
        </Button>

        <Button
          type="button"
          disabled={submitting || !eventId}
          onClick={handleDelete}
        >
          Hapus acara
        </Button>
      </div>
    </Form>
  );
};
