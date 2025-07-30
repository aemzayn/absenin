import { MembersService } from "~/services/members.service";
import type { Route } from "./+types/members";
import type { Member } from "~/interfaces/member";
import { MembersPage } from "~/pages/members/MembersPage";

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

export default function MembersRoute({ loaderData }: Route.ComponentProps) {
  const members: Member[] = loaderData.members;
  return <MembersPage members={members} />;
}
