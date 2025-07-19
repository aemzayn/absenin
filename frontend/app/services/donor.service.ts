import apiClient from "~/api/client";
import type { Donor } from "~/interfaces/donor";

export class DonorService {
  static async getDonors(organizationId: number) {
    return apiClient.get(`/v1/donors/list/${organizationId}`);
  }

  static async getDonorById(donorId: number) {
    return apiClient.get(`/v1/donors/${donorId}`);
  }

  static async createDonor(donor: Partial<Donor>) {
    return apiClient.post("/v1/donors", donor);
  }

  static async updateDonor(donorId: number, donor: Partial<Donor>) {
    return apiClient.put(`/v1/donors/${donorId}`, donor);
  }

  static async deleteDonor(donorId: number) {
    return apiClient.delete(`/v1/donors/${donorId}`);
  }

  static async getDonorByMemberId(memberId: number) {
    return apiClient.get(`/v1/donors/member/${memberId}`);
  }
}
