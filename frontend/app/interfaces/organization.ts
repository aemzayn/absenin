export type Organization = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrganization = Omit<
  Organization,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateOrganization = Partial<CreateOrganization>;
