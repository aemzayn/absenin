import type { Organization } from "~/interfaces/organization";
import { useNavigate } from "react-router";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

type Props = {
  organization: Organization;
};

export function OrganizationCard({ organization }: Props) {
  const navigate = useNavigate();

  return (
    <Card title={organization.name}>
      <p>{organization.description}</p>
      <Button
        onClick={() => {
          navigate(`/organization/${organization.id}`);
        }}
        label="Kunjungi"
      />
    </Card>
  );
}
