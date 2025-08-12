"use client";

import type React from "react";
import {
  usePermissions,
  type Permission,
} from "~/contexts/permissions-context";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Lock } from "lucide-react";

interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}

export function PermissionAlert({
  permission,
  permissions,
  requireAll = false,
}: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
}) {
  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Lock className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        You don't have permission to access this feature. Contact your
        administrator if you need access.
      </AlertDescription>
    </Alert>
  );
}

export function RestrictedButton({
  permission,
  permissions,
  requireAll = false,
  children,
  className = "",
  ...props
}: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true;
  }

  return (
    <button
      {...props}
      disabled={!hasAccess || props.disabled}
      className={`${className} ${
        !hasAccess ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={
        !hasAccess ? "You don't have permission for this action" : props.title
      }
    >
      {children}
    </button>
  );
}
