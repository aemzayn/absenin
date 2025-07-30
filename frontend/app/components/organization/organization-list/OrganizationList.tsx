import type { Organization } from "~/interfaces/organization";
import { OrganizationCard } from "~/components/organization/organization-card/OrganizationCard";
import "./organization-list.scss";

type OrganizationListProps = {
  organizations: Organization[];
  showAddButton?: boolean;
  onAddButtonClick?: () => void;
};

export const OrganizationList = ({
  organizations,
  showAddButton,
  onAddButtonClick = () => {}, // Default to a no-op function if not provided
}: OrganizationListProps) => {
  return (
    <div className="organization-list">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}

      {showAddButton && (
        <div className="organization-list__add-button">
          <button
            className="p-button p-component p-button-outlined"
            onClick={onAddButtonClick}
          >
            Tambah Organisasi
          </button>
        </div>
      )}
    </div>
  );
};
