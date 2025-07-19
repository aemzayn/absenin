import apiClient from "~/api/client";
import { type Member } from "~/interfaces/member";

export class MembersService {
  static async getMembers({ organizationId }: { organizationId: number }) {
    return apiClient.get("/v1/members", {
      params: { organizationId },
    });
  }

  static async createMember(organizationId: number, member: Partial<Member>) {
    return apiClient.post("/v1/members", { organizationId, member });
  }

  static async createMembers(
    organizationId: number,
    members: Partial<Member>[]
  ) {
    return apiClient.post("/v1/members/many-members", {
      organizationId,
      members,
    });
  }

  static async updateMember(id: number, member: Member) {
    return apiClient.put(`/v1/members/${id}`, member);
  }

  static async getMember(id: number) {
    return apiClient.get(`/v1/members/${id}`);
  }

  static async deleteMember(id: number) {
    return apiClient.delete(`/v1/members/${id}`);
  }
}
