import { Badge } from "primereact/badge";

type Props = {
  isAttended: boolean;
};

export const AttendeeBadge = ({ isAttended }: Props) => {
  return isAttended ? (
    <Badge severity="success">Hadir</Badge>
  ) : (
    <Badge severity="warning">Belum hadir</Badge>
  );
};
