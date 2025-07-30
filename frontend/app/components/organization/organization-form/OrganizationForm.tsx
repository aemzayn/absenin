import { useRef, useState } from "react";
import { Form } from "react-router";
import { OrganizationService } from "~/services/organization.service";
import type {
  CreateOrganization,
  Organization,
} from "~/interfaces/organization";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

type OrganizationFormProps = {
  onCreate?: (formData: Organization) => void;
  onFailure?: (error: Error) => void;
  onUpdate?: (formData: Organization) => void;
  selectedOrganization?: Organization | null;
  isEdit?: boolean;
};

export const OrganizationForm = ({
  onCreate,
  onUpdate,
  onFailure,
  selectedOrganization,
  isEdit = false,
}: OrganizationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<CreateOrganization>>({
    name: selectedOrganization?.name || "",
  });
  const toast = useRef<Toast>(null);

  const handleCreate = async () => {
    try {
      setSubmitting(true);

      if (!form.name) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Nama organisasi tidak boleh kosong",
        });
        return;
      }

      const res = await OrganizationService.createOrganization({
        name: form.name,
      });

      const organization: Organization = res.data.data;

      onCreate?.(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      onFailure?.(error as Error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedOrganization) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Tidak ada organisasi yang dipilih untuk diperbarui",
        });
        return;
      }

      if (!form.name) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Nama organisasi tidak boleh kosong",
        });
        return;
      }

      setSubmitting(true);
      const name = form.name as string;

      if (!selectedOrganization) return;

      const res = await OrganizationService.updateOrganizationById(
        selectedOrganization.id,
        {
          name,
        }
      );

      const updatedOrganization: Organization = res.data.data;

      onUpdate?.(updatedOrganization);
    } catch (error) {
      console.error("Error updating organization:", error);
      onFailure?.(error as Error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Toast ref={toast} />

      <div className="form">
        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label htmlFor="absenin_org_name" className="p-inputgroup-addon">
              Nama Organisasi
            </label>
            <InputText
              id="absenin_org_name"
              name="absenin_org_name"
              type="text"
              required
              minLength={3}
              maxLength={100}
              placeholder="Masukkan nama lengkap organisasi"
              disabled={submitting}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div className="form-footer">
          {!isEdit && (
            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              label={
                submitting
                  ? "Sedang membuat organisasi barumu..."
                  : "Buat sekarang"
              }
            />
          )}

          {isEdit && (
            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              label={
                submitting
                  ? "Sedang memperbarui organisasi..."
                  : "Perbarui sekarang"
              }
            />
          )}
        </div>
      </div>
    </Form>
  );
};
