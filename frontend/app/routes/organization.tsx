import { OrganizationService } from "~/services/organization.service";
import { useLoaderData } from "react-router";
import { OrganizationPage } from "~/pages/organization";
import type { Organization } from "~/interfaces/organization";

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

export default function OrganizationRoute() {
  const loaderData = useLoaderData<typeof clientLoader>();
  const organizations: Organization[] = loaderData.organizations;
  return <OrganizationPage organizations={organizations} />;
}
