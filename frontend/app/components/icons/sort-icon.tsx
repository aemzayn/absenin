import type { SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const SortIcon = ({
  isSorted = false,
}: {
  isSorted: false | SortDirection;
}) => {
  const isAsc = isSorted === "asc";
  const isDesc = isSorted === "desc";
  if (isAsc) {
    return <ArrowUp />;
  } else if (isDesc) {
    return <ArrowDown />;
  }

  return <ArrowUpDown />;
};
