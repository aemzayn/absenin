import { OrganizationService } from "~/services/organization.service";
import type { Route } from "./+types/organization-detail";
import { NotFound } from "~/components/not-found";
import type { Organization } from "~/interfaces/organization";
import { useLoaderData } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MembersTable } from "~/components/members-table";
import { EventsTable } from "~/components/events-table";

export function meta() {
  return [{ title: "Organization Detail" }];
}

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const organizationId = +params.organizationId;
  if (isNaN(organizationId)) {
    throw new Error("Invalid organization ID");
  }
  const res = await OrganizationService.getOrganizationById(organizationId);
  const organization: Organization = res.data.data;
  return organization;
};

export default function OrganizationDetail() {
  const organization = useLoaderData<Organization>();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-5xl font-bold">{organization.name}</h1>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid grid-cols-2 max-w-[400px] ">
          <TabsTrigger value="events">Daftar Acara</TabsTrigger>
          <TabsTrigger value="members">Peserta</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <EventsTable organizationId={organization.id} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTable organizationId={organization.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const ErrorBoundary = () => {
  return <NotFound />;
};
