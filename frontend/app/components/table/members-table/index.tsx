import { useEffect, useRef, useState } from "react";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { downloadQRCode } from "~/lib/download-qr";
import { MemberForm } from "../../form/member-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import type { Donor } from "~/interfaces/donor";
import { Dialog } from "primereact/dialog";
import { MemberImagePreview } from "~/components/image/member-image-preview";
import { QrCode } from "lucide-react";

type MembersTableProps = {
  organizationId: number;
  donors: Donor[];
};

export const MembersTable = ({ organizationId, donors }: MembersTableProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditMember, setIsEditMember] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const toast = useRef<Toast>(null);

  const handleUpdateMember = async (member: Member) => {
    setIsEditMember(true);
    setSelectedMember(member);
    setShowImage(false);
    setShowForm(true);
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!organizationId) return;
    confirmDialog({
      message: "Apakah Anda yakin ingin menghapus peserta ini?",
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await MembersService.deleteMember(memberId);
          setMembers((prev) => prev.filter((member) => member.id !== memberId));
          toast.current?.show({
            severity: "success",
            summary: "Berhasil",
            detail: "Berhasil dihapus",
          });
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Gagal menghapus",
          });
        }
      },
    });
  };

  const handleDownloadQrCode = async (member: Member) => {
    const qr = member.qrcode?.qrcode;
    if (!qr) {
      return;
    }
    const fileName = `${member.name.replace(/\s+/g, "_")}.png`;
    downloadQRCode(qr, fileName);
  };

  const fetchMembers = async () => {
    if (!organizationId) return;
    setLoading(true);
    try {
      const res = await MembersService.getMembers({ organizationId });
      const data: Member[] = res.data.data;
      setMembers(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Gagal memuat data peserta",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  return (
    <div>
      <Toast ref={toast} />
      <Button
        label="Tambah Peserta"
        icon="pi pi-plus"
        onClick={() => {
          setIsEditMember(false);
          setSelectedMember(null);
          setShowForm(true);
        }}
      />
      <DataTable value={members} loading={loading} paginator rows={10}>
        <Column field="memberNo" header="Nomor Anggota" />
        <Column field="name" header="Nama" />
        <Column
          header="Donor"
          body={(rowData) => (
            <span>{rowData.donor ? rowData.donor.name : "Tidak ada"}</span>
          )}
        />
        <Column
          header="Foto Peserta"
          body={(rowData) => (
            <Button
              label="Lihat Foto"
              onClick={() => {
                setSelectedMember(rowData);
                if (rowData.image) {
                  setShowImage(true);
                }
              }}
            ></Button>
          )}
        />
        <Column
          header="QR Code"
          body={(rowData) => (
            <Button
              icon={<QrCode />}
              label="Unduh QR Code"
              onClick={() => handleDownloadQrCode(rowData)}
            ></Button>
          )}
        />
        <Column
          header="Aksi"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                label="Edit"
                onClick={() => handleUpdateMember(rowData)}
              />
              <Button
                icon="pi pi-trash"
                label="Hapus"
                onClick={() => handleRemoveMember(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        visible={showImage}
        onHide={() => {
          setShowImage(false);
          setSelectedMember(null);
        }}
        header={selectedMember?.name || "Foto Peserta"}
        style={{ minWidth: "80vw", maxWidth: "600px" }}
      >
        {selectedMember && <MemberImagePreview member={selectedMember} />}
      </Dialog>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header="Form Peserta"
        style={{ minWidth: "80vw", maxWidth: "600px" }}
      >
        <MemberForm
          organizationId={organizationId}
          donors={donors}
          onCreate={(member) => {
            setMembers((prev) => [...prev, member]);
          }}
          onUpdate={(member) => {
            setMembers((prev) =>
              prev.map((m) => (m.id === member.id ? member : m))
            );
          }}
          isEdit={isEditMember}
          member={selectedMember}
        />
      </Dialog>
    </div>
  );
};
