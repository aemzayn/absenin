import type { Event } from "~/interfaces/event";

export const groupEvents = (events: Event[]) => {
  const today = new Date();
  const todayDate = today.getDate();

  const todayEvents = [];
  const thisWeekEvents = [];
  const futureEvents = [];

  for (const event of events) {
    const eventDate = new Date(event.date);
    console.log(event.name, eventDate.getDate() === todayDate);

    if (eventDate.getDate() === todayDate) {
      todayEvents.push(event);
      continue;
    }

    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() + (6 - today.getDay()))
    );

    if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
      thisWeekEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  }
  return { todayEvents, thisWeekEvents, futureEvents };
};
