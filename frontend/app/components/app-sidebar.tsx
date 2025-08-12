"use client";

import {
  Home,
  Users,
  Calendar,
  QrCode,
  Settings,
  Building,
  UserPlus,
  Shield,
  LogOut,
  Heart,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useInstitution } from "~/contexts/institution-context";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "~/components/ui/sidebar";
import { useAuth } from "~/contexts/auth-contexts";
import { PermissionGuard } from "./permission-guard";
import { UserProfile } from "./user-profile";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Orphans",
    url: "/orphans",
    icon: Users,
    permission: "orphans.view" as const,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    permission: "events.view" as const,
  },
  {
    title: "Donors",
    url: "/donors",
    icon: Heart,
    permission: "donors.view" as const,
  },
  {
    title: "QR Scanner",
    url: "/scanner",
    icon: QrCode,
    permission: "scanner.use" as const,
  },
];

const managementItems = [
  {
    title: "Institutions",
    url: "/institutions",
    icon: Building,
    permission: "institution.view_settings" as const,
  },
  {
    title: "User Management",
    url: "/users",
    icon: UserPlus,
    permission: "users.view" as const,
  },
  {
    title: "Permissions",
    url: "/permissions",
    icon: Shield,
    permission: "institution.manage_permissions" as const,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentInstitution } = useInstitution();
  const { logout } = useAuth();

  return (
    <Sidebar
      collapsible="none"
      className="hidden md:flex border-r border-gray-200 dark:border-gray-800"
    >
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentInstitution ? currentInstitution.name : "Orphanage"}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Management System
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <PermissionGuard key={item.title} permission={item.permission}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGuard>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <PermissionGuard key={item.title} permission={item.permission}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGuard>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-2">
        <UserProfile />
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-md p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
