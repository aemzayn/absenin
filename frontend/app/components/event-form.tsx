import { useState } from "react";
import { Form } from "react-router";
import { Spinner } from "./icons/spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { CreateEvent, Event } from "~/interfaces/event";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import dayjs from "dayjs";
import localize from "dayjs/plugin/localizedFormat";
import { EventService } from "~/services/event.service";

dayjs.extend(localize);

type Props = {
  organizationId: number;
  onCreate?: (event: Event) => void;
  onFailure?: (error: Error) => void;
};

export const EventForm = ({ organizationId, onCreate, onFailure }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    dayjs().add(1, "day").toDate()
  );

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
      console.error("Error creating event:", error);
      onFailure?.(error as Error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5">
      <Form onSubmit={handleCreate}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama acara</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              minLength={3}
              maxLength={100}
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <span>Tanggal acara</span>
              {eventDateFormatted && (
                <span className="text-sm text-gray-500">
                  {eventDateFormatted}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <Calendar
                id="date"
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{
                  before: dayjs().subtract(7, "day").toDate(),
                }}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Lokasi acara (opsional)</Label>
            <Input
              id="location"
              name="location"
              type="text"
              minLength={3}
              maxLength={255}
              disabled={submitting}
              placeholder="Contoh: Jakarta, Indonesia"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi acara (opsional)</Label>
            <Textarea
              id="description"
              name="description"
              minLength={3}
              maxLength={255}
              placeholder="Deskripsi singkat tentang acara ini"
              disabled={submitting}
            />
          </div>
        </div>

        <Button type="submit" className="mt-4" disabled={submitting}>
          {submitting ? (
            <>
              Sedang membuat event...
              <Spinner />
            </>
          ) : (
            "Buat sekarang"
          )}
        </Button>
      </Form>
    </div>
  );
};
