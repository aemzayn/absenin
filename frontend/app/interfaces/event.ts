import type { Member } from "./member";

export type Event = {
  id: number;
  name: String;
  description?: String;
  date: Date;
  location?: String;
  organizationId: number;
  members?: Member[];
};

export type CreateEvent = Pick<Event, "name"> &
  Partial<Pick<Event, "description" | "location" | "date" | "organizationId">>;
