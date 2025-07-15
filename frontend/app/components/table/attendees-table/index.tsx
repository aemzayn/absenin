import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";

import type { Attendee } from "~/interfaces/attendee";
import { InputText } from "primereact/inputtext";

type Props = {
  attendees: Attendee[];
};

export const AttendeesTable = ({ attendees }: Props) => {
  return (
    <div>
      <InputText placeholder="Cari daftar hadir..." />
    </div>
  );
};
