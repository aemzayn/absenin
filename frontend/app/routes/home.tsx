import { Link } from "react-router";
import { OrganizationService } from "~/services/organization.service";
import type { Route } from "./+types/home";
import type { Organization } from "~/interfaces/organization";
import { OrganizationCard } from "~/components/organization-card";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import { EventCardHome } from "~/components/event-card-home";

export function meta() {
  return [{ title: "Home" }];
}

export async function clientLoader() {
  const res = await OrganizationService.getMyOrganizations();
  const organizations = res.data?.data || [];
  const totalOrganizations = organizations.length;

  const res2 = await EventService.getUpcomingEvents();
  const events = res2.data?.data || [];

  return { totalOrganizations, events };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const totalOrganizations: Number = loaderData.totalOrganizations;
  const events: Event[] = loaderData.events;
  const totalEvents = events.length;

  return (
    <div className="container mx-auto p-4">
      Welcome
      <div className="mt-4 flex flex-col gap-4">
        <Link to="/members" className="text-blue-500 hover:underline">
          Go to Members
        </Link>

        <Link to="/scanner" className="text-blue-500 hover:underline">
          Go to Scanner
        </Link>

        {totalEvents === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">No Upcoming Events</h2>
            <p className="text-gray-500">
              There are no upcoming events at the moment.
            </p>
          </div>
        )}

        {events.map((event: Event) => (
          <EventCardHome key={event.id} event={event} />
        ))}

        {totalOrganizations === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">No Organizations Found</h2>
            <p className="text-gray-500">
              You have not joined any organizations yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
