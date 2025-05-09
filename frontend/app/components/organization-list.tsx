import type { Organization } from "~/interfaces/organization";
import { OrganizationCard } from "./organization-card";

type Props = {
  organizations: Organization[];
};

export const OrganizationList = ({ organizations }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
};
