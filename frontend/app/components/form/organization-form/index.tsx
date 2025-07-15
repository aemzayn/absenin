import { useState } from "react";
import { Form } from "react-router";
import { Spinner } from "../../icons/spinner";
import { OrganizationService } from "~/services/organization.service";
import type {
  CreateOrganization,
  Organization,
} from "~/interfaces/organization";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

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
      <div>
        <div>
          <label htmlFor="name">Nama organisasi</label>
          <InputText
            id="name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={255}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        loading={submitting}
        label={
          submitting ? "Sedang membuat organisasi barumu..." : "Buat sekarang"
        }
      ></Button>
    </Form>
  );
};
