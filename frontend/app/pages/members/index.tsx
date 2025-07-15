import { MemberCard } from "~/components/card/member-card";
import type { Member } from "~/interfaces/member";

type MembersProps = {
  members: Member[];
};

export function Members({ members }: MembersProps) {
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
