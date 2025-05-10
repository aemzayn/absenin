import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { dateToString } from "~/lib/date-format";
import { useState } from "react";

type Props = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export const DatePicker = ({ date, setDate }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="w-full justify-start text-left font-base shadow-none bg-white"
          type="button"
        >
          <CalendarIcon />
          {date ? dateToString(date) : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto border-0! p-0 z-[100]">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
};
