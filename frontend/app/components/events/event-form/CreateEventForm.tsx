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
import { isProd } from "~/constants/prod";

dayjs.extend(localize);

type CreateEventFormProps = {
  organizationId: number;
  onCreate?: (event: Event) => void;
};

export const CreateEventForm = ({
  organizationId,
  onCreate,
}: CreateEventFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(dayjs().add(1, "day").toDate());

  const eventDateFormatted = date ? dayjs(date).format("LL") : undefined;

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("absenin_event_name")! as string;
      const location = formData.get("absenin_event_location") as string;
      const description = formData.get("absenin_event_description") as string;

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
    <Form onSubmit={handleCreate} className="form">
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
        <Button type="submit" disabled={submitting}>
          {submitting ? <>Sedang membuat event...</> : "Buat sekarang"}
        </Button>
      </div>
    </Form>
  );
};
