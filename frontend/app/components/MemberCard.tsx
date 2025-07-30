import type { Member } from "~/interfaces/member";

export const MemberCard = ({ member }: { member: Member }) => {
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
