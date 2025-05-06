import type { Organization } from "~/interfaces/organization";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type Props = {
  organization: Organization;
};

export function OrganizationCard({ organization }: Props) {
  return (
    <Card className="w-full max-w-sm bg-white gap-1">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>{organization.description}</CardDescription>
      </CardHeader>
      <CardContent>Acara yang akan datang</CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="neutral" className="w-full"></Button>
      </CardFooter>
    </Card>
  );
}
