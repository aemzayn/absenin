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
    <div className="container mx-auto p-4">
      <h1>Members page</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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
    <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md">
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
