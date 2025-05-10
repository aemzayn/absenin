import apiClient from "~/api/client";
import { type Member } from "~/interfaces/member";

export class MembersService {
  static async getMembers() {
    return apiClient.get("/v1/members");
  }

  static async getMembersByOrganization(organizationId: number) {
    return apiClient.get("/v1/members/organization/" + organizationId);
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

  static async updateMemberById(id: number, member: Member) {
    return apiClient.put(`/v1/members/${id}`, member);
  }

  static async getMemberById(id: number) {
    return apiClient.get(`/v1/members/${id}`);
  }

  static async deleteMemberById(id: number) {
    return apiClient.delete(`/v1/members/${id}`);
  }
}
