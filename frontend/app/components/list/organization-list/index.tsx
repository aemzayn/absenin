import { OrganizationCard } from "~/components/card/organization-card";
import type { Organization } from "~/interfaces/organization";
import "./organization-list.scss";

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
