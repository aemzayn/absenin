import { TabPanel, TabView } from "primereact/tabview";
import { MembersTable } from "~/components/MembersTable";
import { EventsTable } from "~/components/events/events-table/EventsTable";
import type { Organization } from "~/interfaces/organization";
import { useEffect, useState } from "react";
import type { Donor } from "~/interfaces/donor";
import { DonorService } from "~/services/donor.service";
import { DonorTable } from "~/components/donor/donor-table/DonorTable";
import { Button } from "primereact/button";
import { EditIcon } from "~/components/icons/EditIcon";
import { Dialog } from "primereact/dialog";
import { OrganizationForm } from "~/components/organization/organization-form/OrganizationForm";
import { useRevalidator } from "react-router";

type OrganizationDetailProps = {
  organization: Organization;
};

export function OrganizationDetail({ organization }: OrganizationDetailProps) {
  const organizationId = organization.id;

  const [donors, setDonors] = useState<Donor[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);

  const revalidator = useRevalidator();

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

  const onEditClick = () => {
    setShowEditForm(true);
  };

  const onUpdate = (updatedOrganization: Organization) => {
    revalidator.revalidate();
    setShowEditForm(false);
  };

  return (
    <div>
      <div className="flex align-items-baseline mb-4 gap-2">
        <h1 className="m-0">{organization.name}</h1>
        <div>
          <Button
            icon={<EditIcon />}
            onClick={onEditClick}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#5fa5fa",
              width: "2rem",
              height: "2rem",
            }}
          />
        </div>
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

      <Dialog
        visible={showEditForm}
        onHide={() => setShowEditForm(false)}
        header="Edit Organisasi"
      >
        <OrganizationForm
          selectedOrganization={organization}
          onUpdate={onUpdate}
          isEdit
        />
      </Dialog>
    </div>
  );
}
