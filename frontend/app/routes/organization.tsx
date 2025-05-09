import { OrganizationService } from "~/services/organization.service";
import type { Organization } from "~/interfaces/organization";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { OrganizationForm } from "~/components/organization-form";
import { toast } from "sonner";
import { useLoaderData, useRevalidator } from "react-router";
import { OrganizationList } from "~/components/organization-list";

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
    toast.success("Organization created successfully");
    revalidate();
  };

  const handleFailCreateOrganization = () => {
    toast.error("Failed to create organization");
  };

  return (
    <div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        {totalOrganizations === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">No Organizations</h2>
            <p className="text-gray-500">
              You are not a member of any organizations.
            </p>
          </div>
        )}

        <DialogTrigger asChild>
          <Button className="mt-4" size={"sm"}>
            Create Organization
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            onCreate={handleCreateOrganization}
            onFailure={handleFailCreateOrganization}
          />
        </DialogContent>
      </Dialog>

      <div className="mt-4">
        <OrganizationList organizations={organizations} />
      </div>
    </div>
  );
}
