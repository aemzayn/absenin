import { useRef, useState } from "react";
import { Form } from "react-router";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Donor } from "~/interfaces/donor";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { isAxiosError } from "axios";
import { DonorService } from "~/services/donor.service";

type DonorFormProps = {
  organizationId: number;
  onCreate?: (donor: Donor) => void;
  selectedDonor?: Donor | null;
};

export const DonorForm = ({
  organizationId,
  onCreate,
  selectedDonor,
}: DonorFormProps) => {
  const [donorForm, setDonorForm] = useState<Partial<Donor>>({
    name: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("absenin_donor_name") as string;

      const res = await DonorService.createDonor({
        name,
        organizationId,
      });

      const donor: Donor = res.data.data;
      onCreate?.(donor);

      // Reset the form
      formRef.current?.reset();

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

  return (
    <>
      <Form onSubmit={handleCreate} ref={formRef} className="form">
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
            />
          </div>
        </div>

        <div className="form-footer">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>Sedang menambahkan donatur...</>
            ) : (
              "Tambahkan Donatur"
            )}
          </Button>
        </div>
      </Form>

      <Toast ref={toast} />
    </>
  );
};
