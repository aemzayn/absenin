import { useRef, useState } from "react";
import { Form } from "react-router";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Donor } from "~/interfaces/donor";
import { Toast } from "primereact/toast";
import { isAxiosError } from "axios";
import { DonorService } from "~/services/donor.service";

type DonorFormProps = {
  organizationId: number;
  onCreate?: (donor: Donor) => void;
  onUpdate?: (donor: Donor) => void;
  selectedDonor?: Donor | null;
  isEdit: boolean;
};

export const DonorForm = ({
  organizationId,
  selectedDonor,
  isEdit = false,
  onCreate,
  onUpdate,
}: DonorFormProps) => {
  const [donorForm, setDonorForm] = useState<Partial<Donor>>({
    name: selectedDonor?.name || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      const name = donorForm.name as string;

      const res = await DonorService.createDonor({
        name,
        organizationId,
      });

      const donor: Donor = res.data.data;
      onCreate?.(donor);

      toast.current?.show({
        severity: "success",
        summary: "Donatur berhasil ditambahkan",
        detail: `Donatur ${donor.name} berhasil ditambahkan.`,
      });
    } catch (error) {
      console.error("Error creating donor:", error);
      let errorMessage = "Terjadi kesalahan saat menambahkan donatur.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      toast.current?.show({
        severity: "error",
        summary: "Gagal menambahkan donatur",
        detail: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      if (!selectedDonor) return;

      const name = donorForm.name as string;

      const res = await DonorService.updateDonor(selectedDonor.id, {
        id: selectedDonor.id,
        name,
        organizationId,
      });

      const donor: Donor = res.data.data;
      onUpdate?.(donor);

      toast.current?.show({
        severity: "success",
        summary: "Donatur berhasil diperbarui",
        detail: `Donatur ${donor.name} berhasil diperbarui.`,
      });
    } catch (error) {
      console.error("Error updating donor:", error);
      let errorMessage = "Terjadi kesalahan saat memperbarui donatur.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      toast.current?.show({
        severity: "error",
        summary: "Gagal memperbarui donatur",
        detail: errorMessage,
      });
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
    <>
      <Form onSubmit={handleSubmit} ref={formRef} className="form">
        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label htmlFor="absenin_donor_name" className="p-inputgroup-addon">
              Nama Lengkap Donatur
            </label>
            <InputText
              id="absenin_donor_name"
              name="absenin_donor_name"
              type="text"
              required
              minLength={3}
              maxLength={100}
              placeholder="Masukkan nama lengkap donatur"
              disabled={submitting}
              value={donorForm.name}
              onChange={(e) =>
                setDonorForm({ ...donorForm, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-footer">
          {!isEdit && (
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>Sedang menambahkan donatur...</>
              ) : (
                "Tambahkan Donatur"
              )}
            </Button>
          )}

          {isEdit && (
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>Sedang memperbarui donatur...</>
              ) : (
                "Perbarui Donatur"
              )}
            </Button>
          )}
        </div>
      </Form>

      <Toast ref={toast} />
    </>
  );
};
