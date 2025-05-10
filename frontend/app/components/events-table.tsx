import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Event } from "~/interfaces/event";
import { dateToString } from "~/lib/date-format";
import { EventService } from "~/services/event.service";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { CreateEventForm } from "./create-event-form";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type HeaderContext,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { SortIcon } from "./icons/sort-icon";
import { Input } from "./ui/input";

type Props = {
  organizationId: number;
};

type SortableHeaderProps = {
  title: string;
  context: HeaderContext<Event, unknown>;
};

const SortableHeader = ({ title, context }: SortableHeaderProps) => {
  const column = context.column;
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <SortIcon isSorted={isSorted} />
    </Button>
  );
};

export const EventsTable = ({ organizationId }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: (ctx) => <SortableHeader title="Nama" context={ctx} />,
    },
    {
      accessorKey: "description",
      header: (ctx) => <SortableHeader title="Keterangan" context={ctx} />,
    },
    {
      accessorKey: "location",
      header: (ctx) => <SortableHeader title="Lokasi" context={ctx} />,
    },
    {
      accessorKey: "date",
      header: (ctx) => <SortableHeader title="Tanggal" context={ctx} />,
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return <span>{dateToString(date)}</span>;
      },
    },
  ];

  const table = useReactTable({
    data: events,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const fetchEvents = async () => {
    if (!organizationId) {
      setEvents([]);
      return;
    }
    try {
      const res = await EventService.getUpcomingEventsByOrganization(
        organizationId
      );
      const events: Event[] = res.data.data;
      setEvents(events);
    } catch (error) {
      toast.error("Error getting events");
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [organizationId]);

  const onEventCreated = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    toast.success("Event created successfully");
    setShowForm(false);
  };

  const onEventCreationFailed = (error: Error) => {
    toast.error("Error creating event");
    console.error("Error creating event:", error);
  };

  return (
    <>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <div className="flex items-center justify-between w-full gap-2 mb-2">
          <DialogTrigger asChild>
            <Button className="bg-blue-200" onClick={() => {}} size={"sm"}>
              Tambah acara
            </Button>
          </DialogTrigger>

          <Input
            placeholder="Cari acara..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat acara baru</DialogTitle>
          </DialogHeader>
          <CreateEventForm
            organizationId={organizationId}
            onCreate={onEventCreated}
            onFailure={onEventCreationFailed}
          />
        </DialogContent>
      </Dialog>

      <div className="border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-blue-500 hover:bg-blue-500 text-foreground"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-foreground" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="bg-blue-200 hover:bg-blue-300 text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
