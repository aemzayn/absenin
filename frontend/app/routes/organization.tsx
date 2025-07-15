import { OrganizationService } from "~/services/organization.service";
import type { Organization } from "~/interfaces/organization";
import { useState } from "react";
import { OrganizationForm } from "~/components/form/organization-form";
import { useLoaderData, useRevalidator } from "react-router";
import { OrganizationList } from "~/components/organization-list";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export function meta() {
  return [{ title: "My Organization" }];
}

export async function clientLoader() {
  const res = await OrganizationService.getMyOrganizations();
  const organizations = res.data.data ?? [];

  return {
    organizations,
  };
}

export default function OrganizationPage() {
  const [showForm, setShowForm] = useState(false);

  const loaderData = useLoaderData<typeof clientLoader>();
  const organizations: Organization[] = loaderData.organizations;
  const totalOrganizations = organizations.length;

  const { revalidate } = useRevalidator();

  const handleCreateOrganization = () => {
    setShowForm(false);
    revalidate();
  };

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

      <div className="mt-4">
        <OrganizationList organizations={organizations} />
      </div>
    </div>
  );
}
