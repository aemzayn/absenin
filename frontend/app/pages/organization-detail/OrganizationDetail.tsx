import { TabPanel, TabView } from "primereact/tabview";
import { MembersTable } from "~/components/MembersTable";
import { EventsTable } from "~/components/events/events-table/EventsTable";
import type { Organization } from "~/interfaces/organization";
import { useEffect, useState } from "react";
import type { Donor } from "~/interfaces/donor";
import { DonorService } from "~/services/donor.service";
import { DonorTable } from "~/components/donor/donor-table/DonorTable";

type OrganizationDetailProps = {
  organization: Organization;
};

export function OrganizationDetail({ organization }: OrganizationDetailProps) {
  const organizationId = organization.id;

  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchDonors = async () => {
      const response = await DonorService.getDonors(organizationId);
      const donors = response.data.data as Donor[];
      if (!donors) {
        setDonors([]);
        return;
      }
      setDonors(donors);
    };
    fetchDonors();
  }, [organizationId]);

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
          <MembersTable donors={donors} organizationId={organization.id} />
        </TabPanel>

        <TabPanel header="Donatur">
          <DonorTable
            organizationId={organization.id}
            donors={donors}
            setDonors={setDonors}
          />
        </TabPanel>
      </TabView>
    </div>
  );
}
