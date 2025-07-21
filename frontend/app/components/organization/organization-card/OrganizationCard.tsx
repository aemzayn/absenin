import type { Organization } from "~/interfaces/organization";
import { useNavigate } from "react-router";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./organization-card.scss";
import { ORGANIZATION_ID_ROUTE } from "~/constants/routes";

type Props = {
  organization: Organization;
};

export function OrganizationCard({ organization }: Props) {
  const navigate = useNavigate();

  return (
    <Card title={organization.name} className="organization-card">
      <p>{organization.description}</p>
      <Button
        onClick={() => {
          navigate(ORGANIZATION_ID_ROUTE(organization.id));
        }}
        label="Kunjungi"
        size="small"
      />
    </Card>
  );
}
