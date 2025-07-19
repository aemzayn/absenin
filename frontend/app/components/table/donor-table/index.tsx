import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import type { Donor } from "~/interfaces/donor";
import { NumberBodyTemplate } from "../body-templates/number-template";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DonorForm } from "~/components/form/donor-form";

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

  return (
    <div>
      <Button
        label="Tambah Donatur"
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
      </DataTable>

      <Dialog
        visible={showForm}
        onHide={() => setShowForm(false)}
        header="Donatur"
        style={{ minWidth: "80vw", maxWidth: "600px" }}
      >
        <DonorForm
          organizationId={organizationId}
          onCreate={(donor: Donor) => {
            setDonors((prev: Donor[]) => [...prev, donor]);
          }}
        />
      </Dialog>
    </div>
  );
}
