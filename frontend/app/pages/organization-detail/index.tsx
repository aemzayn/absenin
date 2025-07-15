import { TabPanel, TabView } from "primereact/tabview";
import { MembersTable } from "~/components/table/members-table";
import { EventsTable } from "~/components/table/events-table";
import type { Organization } from "~/interfaces/organization";

type OrganizationDetailProps = {
  organization: Organization;
};

export function OrganizationDetail({ organization }: OrganizationDetailProps) {
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
