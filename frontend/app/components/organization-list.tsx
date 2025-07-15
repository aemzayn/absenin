import type { Organization } from "~/interfaces/organization";
import { OrganizationCard } from "./organization-card";

type Props = {
  organizations: Organization[];
};

export const OrganizationList = ({ organizations }: Props) => {
  return (
    <div>
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
};
