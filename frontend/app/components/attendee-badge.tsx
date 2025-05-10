import { Badge } from "./ui/badge";

type Props = {
  isAttended: boolean;
};

export const AttendeeBadge = ({ isAttended }: Props) => {
  return isAttended ? (
    <Badge variant="success">Hadir</Badge>
  ) : (
    <Badge variant="warning">Belum hadir</Badge>
  );
};
