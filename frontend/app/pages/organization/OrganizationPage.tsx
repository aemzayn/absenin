import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { OrganizationForm } from "~/components/organization/organization-form/OrganizationForm";
import { OrganizationList } from "~/components/organization/organization-list/OrganizationList";
import type { Organization } from "~/interfaces/organization";

type OrganizationProps = {
  organizations: Organization[];
};

export function OrganizationPage({ organizations }: OrganizationProps) {
  const [showForm, setShowForm] = useState(false);

  const totalOrganizations = organizations.length;

  const { revalidate } = useRevalidator();

  const handleCreateOrganization = () => {
    setShowForm(false);
    revalidate();
  };

  console.log(showForm);

  const handleFailCreateOrganization = () => {};

  return (
    <div>
      {totalOrganizations === 0 && (
        <>
          <div>
            <h2>Organisasi tidak ditemukan</h2>
            <p>
              Anda belum memiliki organisasi. Silakan buat organisasi baru untuk
              memulai.
            </p>
          </div>

          <Button onClick={() => setShowForm(true)}>Buat organisasi</Button>
        </>
      )}

      <OrganizationList organizations={organizations} />

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header="Buat Organisasi"
      >
        <OrganizationForm
          onCreate={handleCreateOrganization}
          onFailure={handleFailCreateOrganization}
        />
      </Dialog>
    </div>
  );
}
