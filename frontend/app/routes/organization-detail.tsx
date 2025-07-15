import { OrganizationService } from "~/services/organization.service";
import type { Route } from "./+types/organization-detail";
import { NotFound } from "~/components/ui/not-found";
import type { Organization } from "~/interfaces/organization";
import { useLoaderData } from "react-router";
import { MembersTable } from "~/components/members-table";
import { EventsTable } from "~/components/table/events-table";
import { TabPanel, TabView } from "primereact/tabview";

export function meta() {
  return [{ title: "Organization Detail" }];
}

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const organizationId = +params.organizationId;
  if (isNaN(organizationId)) {
    throw new Error("Invalid organization ID");
  }
  const res = await OrganizationService.getOrganizationById(organizationId);
  const organization: Organization = res.data.data;
  return organization;
};

export default function OrganizationDetail() {
  const organization = useLoaderData<Organization>();

  return (
    <div>
      <div>
        <h1>{organization.name}</h1>
      </div>

      <TabView>
        <TabPanel header="Daftar Acara">
          <EventsTable organizationId={organization.id} />
        </TabPanel>

        <TabPanel header="Peserta">
          <MembersTable organizationId={organization.id} />
        </TabPanel>
      </TabView>
    </div>
  );
}

export const ErrorBoundary = () => {
  return <NotFound />;
};
