import { useState } from "react";
import { Form } from "react-router";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Spinner } from "./icons/spinner";
import { OrganizationService } from "~/services/organization.service";
import type {
  CreateOrganization,
  Organization,
} from "~/interfaces/organization";

type Props = {
  onCreate?: (formData: Organization) => void;
  onFailure?: (error: Error) => void;
};

export const OrganizationForm = ({ onCreate, onFailure }: Props) => {
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name")! as string;
      const organizationData: CreateOrganization = {
        name,
      };

      const res = await OrganizationService.createOrganization(
        organizationData
      );

      const organization: Organization = res.data.data;

      onCreate?.(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      onFailure?.(error as Error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleCreate}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Nama organisasi</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={255}
          />
        </div>
      </div>

      <Button type="submit" className="mt-4" disabled={submitting}>
        {submitting ? (
          <>
            Sedang membuat organisasi barumu...
            <Spinner />
          </>
        ) : (
          "Buat sekarang"
        )}
      </Button>
    </Form>
  );
};
