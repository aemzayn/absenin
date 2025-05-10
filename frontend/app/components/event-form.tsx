import { useState } from "react";
import { Form } from "react-router";
import { Spinner } from "./icons/spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { type CreateEvent } from "~/interfaces/event";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import dayjs from "dayjs";
import localize from "dayjs/plugin/localizedFormat";

dayjs.extend(localize);

export const EventForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateEvent>({
    name: "",
    description: undefined,
    location: undefined,
    date: dayjs().add(1, "day").toDate(),
  });

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {};

  const eventDateFormatted = form.date
    ? dayjs(form.date).format("LL")
    : undefined;

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
              maxLength={255}
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
                selected={form.date}
                onSelect={(date) => setForm({ ...form, date })}
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
