"use client";

import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useInstitution } from "~/contexts/institution-context";
import { useAuth } from "~/contexts/auth-contexts";

export function UserProfile() {
  const { user, logout } = useAuth();
  const { currentInstitution } = useInstitution();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start p-2 h-auto dark:text-gray-100"
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentInstitution?.role || "User"}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 dark:bg-gray-800 dark:border-gray-700"
      >
        <DropdownMenuLabel className="dark:text-gray-100">
          <div>
            <p className="font-medium dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 focus:text-red-600  dark:focus:text-red-400 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
