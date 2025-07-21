import { useEffect, useRef, useState } from "react";
import { Form } from "react-router";
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

type MemberFormProps = {
  organizationId: number;
  donors: Donor[];
  isEdit?: boolean;
  member?: Member | null;
  onCreate?: (member: Member) => void;
  onUpdate?: (member: Member) => void;
};

export const MemberForm = ({
  organizationId,
  donors,
  onCreate,
  onUpdate,
  isEdit = false,
  member = null,
}: MemberFormProps) => {
  const [memberForm, setMemberForm] = useState<Omit<Member, "id">>({
    name: member?.name || "",
    donorId: member?.donorId || null,
    image: member?.image || null,
    memberNo: member?.memberNo || null,
  });

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();

      const res = await MembersService.createMember(organizationId, {
        name: memberForm.name,
        memberNo: memberForm.memberNo ? +memberForm.memberNo : null,
        donorId: memberForm.donorId,
        image: memberForm.image,
      });

      const member: Member = res.data.data;
      onCreate?.(member);

      console.log(member);

      formRef.current?.reset();
      fileUploadRef.current?.clear();
      setMemberForm({
        name: "",
        donorId: null,
        image: null,
        memberNo: null,
      });

      toast.current?.show({
        severity: "success",
        summary: "Anggota berhasil ditambahkan",
        detail: `Anggota ${member.name} berhasil ditambahkan.`,
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menambahkan anggota.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      toast.current?.show({
        severity: "error",
        summary: "Gagal menambahkan anggota",
        detail:
          "Terjadi kesalahan saat menambahkan anggota. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      if (!member) return;

      const res = await MembersService.updateMember(member.id, {
        id: member.id,
        name: memberForm.name,
        memberNo: memberForm.memberNo ? +memberForm.memberNo : null,
        donorId: memberForm.donorId,
        image: memberForm.image,
      });

      const updatedMember: Member = res.data.data;

      onUpdate?.(updatedMember);
      toast.current?.show({
        severity: "success",
        summary: "Anggota berhasil diperbarui",
        detail: `Anggota ${updatedMember.name} berhasil diperbarui.`,
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat memperbarui anggota.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      toast.current?.show({
        severity: "error",
        summary: "Gagal memperbarui anggota",
        detail: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (props: FileUploadSelectEvent) => {
    const file = props.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMemberForm({
          ...memberForm,
          image: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit) {
      handleUpdate(event);
    } else {
      handleCreate(event);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formRef} className="form">
        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label htmlFor="absenin_member_name" className="p-inputgroup-addon">
              Nama Lengkap
            </label>
            <InputText
              id="absenin_member_name"
              name="absenin_member_name"
              type="text"
              required
              minLength={3}
              maxLength={100}
              placeholder="Masukkan nama lengkap anggota"
              disabled={submitting}
              value={memberForm.name}
              onChange={(e) =>
                setMemberForm({ ...memberForm, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label
              htmlFor="absenin_member_number"
              className="p-inputgroup-addon"
            >
              Nomor Anggota
            </label>
            <InputNumber
              id="absenin_member_number"
              name="absenin_member_number"
              required
              placeholder="Masukkan nomor anggota"
              disabled={submitting}
              value={memberForm.memberNo}
              onValueChange={(e) =>
                setMemberForm({ ...memberForm, memberNo: e.value ?? null })
              }
            />
          </div>
        </div>

        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label
              htmlFor="absenin_member_donor"
              className="p-inputgroup-addon"
            >
              Donatur
            </label>
            <Dropdown
              id="absenin_member_donor"
              name="absenin_member_donor"
              required
              placeholder="Pilih donatur"
              emptyMessage="Tidak ada donatur"
              disabled={submitting}
              options={donors.map((donor) => ({
                label: donor.name,
                value: donor.id,
              }))}
              value={memberForm.donorId}
              onChange={(e) =>
                setMemberForm({ ...memberForm, donorId: e.value })
              }
              showClear
              filter
            />
          </div>
        </div>

        <div className="form-field form-field-full">
          <div className="p-inputgroup flex-1">
            <label
              htmlFor="absenin_member_image"
              className="p-inputgroup-addon"
            >
              Foto Anggota
            </label>
            <FileUpload
              ref={fileUploadRef}
              style={{ width: "100%" }}
              multiple={false}
              mode="advanced"
              accept="image/png,image/jpeg"
              maxFileSize={5000000}
              id="absenin_member_image"
              name="absenin_member_image"
              onSelect={handleFileChange}
              onClear={() => setMemberForm({ ...memberForm, image: null })}
              chooseLabel="Pilih Foto"
              uploadOptions={{
                style: { display: "none" },
              }}
            />
          </div>
        </div>

        <div className="form-footer">
          {isEdit ? (
            <Button
              type="submit"
              label="Perbarui Anggota"
              icon="pi pi-check"
              className="p-button-success"
              loading={submitting}
            />
          ) : (
            <Button
              type="submit"
              label="Tambah Anggota"
              icon="pi pi-plus"
              className="p-button-success"
              loading={submitting}
            />
          )}
        </div>
      </Form>

      <Toast ref={toast} />
    </>
  );
};
