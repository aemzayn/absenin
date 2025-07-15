import { MembersService } from "~/services/members.service";
import type { Route } from "./+types/members";
import type { Member } from "~/interfaces/member";

export async function clientLoader() {
  const res = await MembersService.getMembers();
  const members = res.data?.data || [];
  return { members };
}

export function meta() {
  return [
    {
      title: "Members",
    },
  ];
}

export default function Members({ loaderData }: Route.ComponentProps) {
  const members: Member[] = loaderData.members;

  return (
    <div>
      <h1>Members page</h1>

      <div>
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

const MemberCard = ({ member }: { member: Member }) => {
  const qrCode = member.qrcode?.qrcode;

  return (
    <div>
      <h2>{member.name}</h2>
      {qrCode && (
        <img
          src={qrCode}
          alt={`QR Code for ${member.name}`}
          className="qr-code"
        />
      )}
    </div>
  );
};
