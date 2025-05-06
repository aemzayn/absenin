import type { Member } from "./member";

export type Event = {
  id: number;
  name: String;
  description?: String;
  date: Date;
  location?: String;

  members?: Member[];
};
