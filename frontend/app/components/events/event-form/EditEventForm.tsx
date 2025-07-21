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
import { isProd } from "~/constants/prod";

dayjs.extend(localize);

type EditEventFormProps = {
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
}: EditEventFormProps) => {
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
    <Form onSubmit={handleUpdate} className="form">
      <div className="form-field form-field-full">
        <div className="p-inputgroup flex-1">
          <label htmlFor="absenin_event_name" className="p-inputgroup-addon">
            Nama Acara
          </label>
          <InputText
            id="absenin_event_name"
            name="absenin_event_name"
            type="text"
            required
            minLength={3}
            maxLength={100}
            placeholder="Bakti sosial"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-field form-field-full">
        <div className="p-inputgroup flex-1">
          <label htmlFor="absenin_event_date" className="p-inputgroup-addon">
            Tanggal acara
          </label>
          <Calendar
            id="absenin_event_date"
            name="absenin_event_date"
            value={date}
            onChange={(e) => setDate(e.value ?? null)}
            showIcon
            showButtonBar
            dateFormat="dd/mm/yy"
            placeholder="Pilih tanggal acara"
            disabled={submitting}
            minDate={isProd ? dayjs().subtract(1, "day").toDate() : undefined}
          />
        </div>
      </div>

      <div className="form-field form-field-full">
        <div className="p-inputgroup flex-1">
          <label
            className="p-inputgroup-addon"
            htmlFor="absenin_event_location"
          >
            Lokasi acara (opsional)
          </label>
          <InputText
            id="absenin_event_location"
            name="absenin_event_location"
            type="text"
            minLength={3}
            maxLength={255}
            disabled={submitting}
            placeholder="Contoh: Jakarta, Indonesia"
          />
        </div>
      </div>

      <div className="form-field form-field-full">
        <div className="p-inputgroup flex-1">
          <label
            className="p-inputgroup-addon"
            htmlFor="absenin_event_description"
          >
            Deskripsi acara (opsional)
          </label>
          <InputTextarea
            id="absenin_event_description"
            name="absenin_event_description"
            minLength={3}
            maxLength={255}
            rows={4}
            placeholder="Deskripsi singkat tentang acara ini"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-footer">
        <Button
          type="button"
          disabled={submitting || !eventId}
          onClick={handleDelete}
          severity="danger"
          label="Hapus acara"
        />

        <Button
          type="submit"
          disabled={submitting}
          label={submitting ? "Sedang memperbarui acara..." : "Update acara"}
        />
      </div>
    </Form>
  );
};
