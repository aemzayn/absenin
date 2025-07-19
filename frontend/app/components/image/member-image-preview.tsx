import type { Member } from "~/interfaces/member";

type MemberImagePreviewProps = {
  member: Member;
};

export function MemberImagePreview({ member }: MemberImagePreviewProps) {
  const image = member.image;

  if (!image || image === "") {
    return (
      <div className="member-image-preview">
        <div>Gambar tidak tersedia</div>
        <div className="member-name">{member.name}</div>
      </div>
    );
  }

  return (
    <div className="member-image-preview">
      <img src={image} alt={member.name} className="member-image" />
      <div className="member-name">{member.name}</div>
    </div>
  );
}
