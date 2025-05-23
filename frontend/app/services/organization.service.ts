import apiClient from "~/api/client";
import type {
  CreateOrganization,
  UpdateOrganization,
} from "~/interfaces/organization";

export class OrganizationService {
  static async getMyOrganizations() {
    return apiClient.get("/v1/organizations");
  }

  static async createOrganization(organization: CreateOrganization) {
    return apiClient.post("/v1/organizations", organization);
  }

  static async updateOrganizationById(
    id: number,
    organization: UpdateOrganization
  ) {
    return apiClient.put(`/v1/organizations/${id}`, organization);
  }

  static async getOrganizationById(id: number) {
    return apiClient.get(`/v1/organizations/${id}`);
  }

  static async deleteOrganizationById(id: number) {
    return apiClient.delete(`/v1/organizations/${id}`);
  }
}
