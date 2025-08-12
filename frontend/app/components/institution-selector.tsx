import { Check, ChevronsUpDown, Building } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import { useInstitution } from "~/contexts/institution-context";
import { cn } from "~/lib/utils";

export function InstitutionSelector() {
  const [open, setOpen] = useState(false);
  const { institutions, currentInstitution, setCurrentInstitution } =
    useInstitution();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100";
      case "staff":
        return "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100";
      case "volunteer":
        return "bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between bg-transparent dark:border-gray-700 dark:text-gray-100"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium dark:text-gray-100">
                {currentInstitution
                  ? currentInstitution.name
                  : "Select institution..."}
              </span>
              {currentInstitution && (
                <Badge
                  className={`text-xs ${getRoleBadgeColor(
                    currentInstitution.role
                  )}`}
                >
                  {currentInstitution.role}
                </Badge>
              )}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 dark:bg-gray-800 dark:border-gray-700">
        <Command>
          <CommandInput
            placeholder="Search institutions..."
            className="dark:bg-gray-800"
          />
          <CommandList>
            <CommandEmpty>No institution found.</CommandEmpty>
            <CommandGroup>
              {institutions.map((institution) => (
                <CommandItem
                  key={institution.id}
                  value={institution.name}
                  onSelect={() => {
                    setCurrentInstitution(institution);
                    setOpen(false);
                  }}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentInstitution?.id === institution.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium dark:text-gray-100">
                      {institution.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`text-xs ${getRoleBadgeColor(
                          institution.role
                        )}`}
                      >
                        {institution.role}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {institution.currentOrphans} orphans
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
