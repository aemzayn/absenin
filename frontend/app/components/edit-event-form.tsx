import { useEffect, useRef, useState } from "react";
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
import { toast } from "sonner";

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
  const [date, setDate] = useState<Date | undefined>(
    dayjs().add(1, "day").toDate()
  );

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
      toast.success("Acara berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui acara");
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
      toast.success("Acara berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus acara");
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

      <div className="flex items-center justify-between mt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              Sedang membuat event...
              <Spinner />
            </>
          ) : (
            "Update event"
          )}
        </Button>

        <Button
          type="button"
          disabled={submitting || !eventId}
          className="bg-red-400 hover:bg-red-500"
          onClick={handleDelete}
        >
          Hapus event
        </Button>
      </div>
    </Form>
  );
};
