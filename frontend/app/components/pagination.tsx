import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Pagination({
  currentPage,
  totalPages,
  goLeft,
  goRight,
}: {
  currentPage: number;
  totalPages: number;
  goLeft: () => void;
  goRight: () => void;
}) {
  const buttonClass = "bg-blue-200 p-2 rounded disabled:opacity-50 w-8 h-8";
  return (
    <div className="flex items-center justify-center mx-auto w-full ">
      <div className="flex items-center gap-2">
        <Button
          onClick={goLeft}
          disabled={currentPage === 1}
          className="bg-blue-200 p-2 rounded disabled:opacity-50 w-8 h-8"
        >
          <ChevronLeftIcon />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={goRight}
          disabled={currentPage === totalPages}
          className={buttonClass}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
