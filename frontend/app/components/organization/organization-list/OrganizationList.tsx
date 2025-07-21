import type { Organization } from "~/interfaces/organization";
import "./organization-list.scss";
import { OrganizationCard } from "~/components/organization/organization-card/OrganizationCard";

type Props = {
  organizations: Organization[];
};

export const OrganizationList = ({ organizations }: Props) => {
  return (
    <div className="organization-list">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
};
