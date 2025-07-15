import { OrganizationService } from "~/services/organization.service";
import { NotFound } from "~/components/ui/not-found";
import { useLoaderData } from "react-router";
import { OrganizationDetail } from "~/pages/organization-detail";
import type { Route } from "./+types/organization-detail";
import type { Organization } from "~/interfaces/organization";

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

export default function OrganizationDetailRoute() {
  const organization = useLoaderData<Organization>();
  return <OrganizationDetail organization={organization} />;
}

export const ErrorBoundary = () => {
  return <NotFound />;
};
