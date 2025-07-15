import { useState } from "react";
import { Form } from "react-router";
import type { CreateEvent, Event } from "~/interfaces/event";
import dayjs from "dayjs";
import localize from "dayjs/plugin/localizedFormat";
import { EventService } from "~/services/event.service";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

dayjs.extend(localize);

type Props = {
  organizationId: number;
  onCreate?: (event: Event) => void;
};

export const CreateEventForm = ({ organizationId, onCreate }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(dayjs().add(1, "day").toDate());

  const eventDateFormatted = date ? dayjs(date).format("LL") : undefined;

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name")! as string;
      const location = formData.get("location") as string;
      const description = formData.get("description") as string;

      const res = await EventService.createEvent({
        name,
        location,
        date: dayjs(date).startOf("day").toDate(),
        description,
        organizationId,
      });

      const newEvent = res.data.data;
      onCreate?.(newEvent);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleCreate}>
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

      <Button type="submit" disabled={submitting}>
        {submitting ? <>Sedang membuat event...</> : "Buat sekarang"}
      </Button>
    </Form>
  );
};
