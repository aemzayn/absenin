import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef, useState } from "react";
import type { Donor } from "~/interfaces/donor";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DonorForm } from "~/components/donor/donor-form/DonorForm";
import { NumberBodyTemplate } from "~/components/table/body-templates/NumberBodyTemplate";
import { PlusIcon } from "~/components/icons/PlusIcon";
import { EditIcon } from "~/components/icons/EditIcon";
import { TrashIcon } from "~/components/icons/TrashIcon";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { DonorService } from "~/services/donor.service";

type DonorTableProps = {
  organizationId: number;
  donors: Donor[];
  setDonors: React.Dispatch<React.SetStateAction<Donor[]>>;
};

export function DonorTable({
  organizationId,
  donors,
  setDonors,
}: DonorTableProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isEditDonor, setIsEditDonor] = useState(false);
  const toast = useRef<Toast>(null);

  const handleUpdateDonor = (donor: Donor) => {
    setIsEditDonor(true);
    setSelectedDonor(donor);
    setShowForm(true);
  };

  const handleRemoveDonor = async (donorId: number) => {
    if (!organizationId) return;
    confirmDialog({
      message: "Apakah Anda yakin ingin menghapus donatur ini?",
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Tidak",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await DonorService.deleteDonor(donorId);
          setDonors((prev) => prev.filter((donor) => donor.id !== donorId));
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
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <Button
        label="Tambah Donatur"
        icon={<PlusIcon />}
        onClick={() => {
          setShowForm(true);
          setIsEditDonor(false);
          setSelectedDonor(null);
        }}
      />
      <DataTable
        value={donors}
        loading={loading}
        paginator
        rows={10}
        emptyMessage="Tidak ada data donatur"
      >
        <Column
          header="Nomor"
          body={(rowData, { rowIndex }) => (
            <NumberBodyTemplate rowIndex={rowIndex} />
          )}
        />
        <Column field="name" header="Nama Donatur" />
        <Column
          header="Aksi"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleUpdateDonor(rowData)}
              />
              <Button
                icon={<TrashIcon />}
                label="Hapus"
                severity="danger"
                onClick={() => handleRemoveDonor(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header="Donatur"
        style={{ minWidth: "80vw", maxWidth: "600px" }}
      >
        <DonorForm
          selectedDonor={selectedDonor}
          organizationId={organizationId}
          onCreate={(donor: Donor) => {
            setDonors((prev: Donor[]) => [...prev, donor]);
          }}
          onUpdate={(donor: Donor) => {
            setDonors((prev: Donor[]) =>
              prev.map((d) => (d.id === donor.id ? donor : d))
            );
          }}
          isEdit={isEditDonor}
        />
      </Dialog>
    </div>
  );
}
