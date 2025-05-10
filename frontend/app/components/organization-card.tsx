import type { Organization } from "~/interfaces/organization";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useNavigate } from "react-router";

type Props = {
  organization: Organization;
};

export function OrganizationCard({ organization }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm bg-white gap-1">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
      </CardHeader>

      <CardContent>{organization.description}</CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full bg-blue-200"
          onClick={() => {
            navigate(`/organization/${organization.id}`);
          }}
        >
          Kunjungi
        </Button>
      </CardFooter>
    </Card>
  );
}
