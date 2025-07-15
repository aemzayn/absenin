import { useEffect, useState } from "react";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { downloadQRCode } from "~/lib/download-qr";
import { useSkipper } from "~/hooks/use-skipper";
import { NewMemberForm } from "./form/member-form";
import { InputText } from "primereact/inputtext";

type Props = {
  organizationId: number;
};

export const MembersTable = ({ organizationId }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const handleUpdateMember = async (member: Member) => {
    if (!organizationId) return;
    try {
      await MembersService.updateMemberById(member.id, member);
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, ...member } : m))
      );
    } catch (error) {}
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!organizationId) return;
    try {
      await MembersService.deleteMemberById(memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
    } catch (error) {}
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
    try {
      const res = await MembersService.getMembersByOrganization(organizationId);
      const data: Member[] = res.data.data;
      setMembers(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  return (
    <div>
      <NewMemberForm
        organizationId={organizationId}
        onCreate={(member) => {
          setMembers((prev) => [...prev, member]);
        }}
      />

      <InputText placeholder="Cari peserta..." />
    </div>
  );
};
