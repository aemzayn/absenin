"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useInstitution } from "./institution-context";

export type Permission =
  // Orphan Management
  | "orphans.view"
  | "orphans.create"
  | "orphans.edit"
  | "orphans.delete"
  | "orphans.assign_donor"
  | "orphans.export"

  // Event Management
  | "events.view"
  | "events.create"
  | "events.edit"
  | "events.delete"
  | "events.start_distribution"
  | "events.view_reports"
  | "events.export"

  // QR Scanner
  | "scanner.use"
  | "scanner.view_history"

  // User Management
  | "users.view"
  | "users.invite"
  | "users.edit_roles"
  | "users.deactivate"
  | "users.delete"

  // Institution Management
  | "institution.view_settings"
  | "institution.edit_settings"
  | "institution.view_analytics"
  | "institution.manage_permissions"
  | "institution.delete"

  // Donor Management
  | "donors.view"
  | "donors.create"
  | "donors.edit"
  | "donors.delete"

  // Reports & Analytics
  | "reports.view_basic"
  | "reports.view_detailed"
  | "reports.export"
  | "analytics.view";

export type Role = "admin" | "staff" | "volunteer";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // Full access to everything
    "orphans.view",
    "orphans.create",
    "orphans.edit",
    "orphans.delete",
    "orphans.assign_donor",
    "orphans.export",
    "events.view",
    "events.create",
    "events.edit",
    "events.delete",
    "events.start_distribution",
    "events.view_reports",
    "events.export",
    "scanner.use",
    "scanner.view_history",
    "users.view",
    "users.invite",
    "users.edit_roles",
    "users.deactivate",
    "users.delete",
    "institution.view_settings",
    "institution.edit_settings",
    "institution.view_analytics",
    "institution.manage_permissions",
    "institution.delete",
    "donors.view",
    "donors.create",
    "donors.edit",
    "donors.delete",
    "reports.view_basic",
    "reports.view_detailed",
    "reports.export",
    "analytics.view",
  ],
  staff: [
    // Most permissions except critical management functions
    "orphans.view",
    "orphans.create",
    "orphans.edit",
    "orphans.assign_donor",
    "orphans.export",
    "events.view",
    "events.create",
    "events.edit",
    "events.start_distribution",
    "events.view_reports",
    "events.export",
    "scanner.use",
    "scanner.view_history",
    "users.view",
    "institution.view_settings",
    "institution.view_analytics",
    "donors.view",
    "donors.create",
    "donors.edit",
    "reports.view_basic",
    "reports.view_detailed",
    "reports.export",
    "analytics.view",
  ],
  volunteer: [
    // Limited permissions - mainly viewing and basic operations
    "orphans.view",
    "events.view",
    "events.start_distribution",
    "scanner.use",
    "scanner.view_history",
    "donors.view",
    "reports.view_basic",
  ],
};

interface PermissionsContextType {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  getUserRole: () => Role | null;
  getPermissionsForRole: (role: Role) => Permission[];
  canAccessPage: (page: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentInstitution } = useInstitution();

  const getUserRole = (): Role | null => {
    return currentInstitution?.role || null;
  };

  const hasPermission = (permission: Permission): boolean => {
    const role = getUserRole();
    if (!role) return false;
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const getPermissionsForRole = (role: Role): Permission[] => {
    return ROLE_PERMISSIONS[role];
  };

  const canAccessPage = (page: string): boolean => {
    switch (page) {
      case "/orphans":
        return hasPermission("orphans.view");
      case "/events":
        return hasPermission("events.view");
      case "/scanner":
        return hasPermission("scanner.use");
      case "/users":
        return hasPermission("users.view");
      case "/institutions":
        return hasPermission("institution.view_settings");
      default:
        return true; // Dashboard and other pages are accessible to all
    }
  };

  return (
    <PermissionsContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getUserRole,
        getPermissionsForRole,
        canAccessPage,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
