import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { downloadQRCode } from "~/lib/download-qr";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { SortIcon } from "./icons/sort-icon";
import { QrCodeIcon } from "lucide-react";
import { useSkipper } from "~/hooks/use-skipper";
import { NewMemberForm } from "./new-member-form";
import { Pagination } from "./pagination";

type Props = {
  organizationId: number;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      rowId: number,
      columnId: string,
      value: unknown
    ) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Member>> = {
  cell: ({ getValue, row: { index, original }, column, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, original.id, column.id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

export const MembersTable = ({ organizationId }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMembers, setEditingMembers] = useState<{
    [key: number]: boolean;
  }>({});

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const handleUpdateMember = async (member: Member) => {
    if (!organizationId) return;
    try {
      await MembersService.updateMemberById(member.id, member);
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, ...member } : m))
      );
      setEditingMembers((prev) => {
        delete prev[member.id];
        return { ...prev };
      });
      toast.success("Data berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui data");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!organizationId) return;
    try {
      await MembersService.deleteMemberById(memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      setEditingMembers((prev) => {
        delete prev[memberId];
        return { ...prev };
      });
      toast.success("Data berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  const handleDownloadQrCode = async (member: Member) => {
    const qr = member.qrcode?.qrcode;
    if (!qr) {
      toast.error("QR code tidak ditemukan");
      return;
    }
    const fileName = `${member.name.replace(/\s+/g, "_")}.png`;
    downloadQRCode(qr, fileName);
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <SortIcon isSorted={isSorted} />
          </Button>
        );
      },
    },
    {
      accessorKey: "qrcode",
      header: () => "QR Code",
      cell: ({ row }) => (
        <Button
          size={"sm"}
          variant={"neutral"}
          onClick={() => handleDownloadQrCode(row.original)}
        >
          Download <QrCodeIcon />
        </Button>
      ),
    },
    {
      accessorKey: "action",
      header: () => null,
      cell: ({ row }) => {
        const member = row.original;
        const editingMember = editingMembers[member.id];
        return (
          <div className="flex gap-2 justify-end">
            {editingMember && (
              <Button
                disabled={loading}
                onClick={() => handleUpdateMember(member)}
                size={"sm"}
                className="bg-green-400"
              >
                Simpan
              </Button>
            )}
            <Button
              disabled={loading}
              onClick={() => {
                handleRemoveMember(member.id);
              }}
              size={"sm"}
              className="bg-red-400"
            >
              Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: members,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    defaultColumn,
    autoResetPageIndex,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData: (rowIndex, rowId, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setEditingMembers((prev) => ({
          ...prev,
          [rowId]: true,
        }));
        setMembers((prev) =>
          prev.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...prev[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const fetchMembers = async () => {
    if (!organizationId) return;
    try {
      const res = await MembersService.getMembersByOrganization(organizationId);
      const data: Member[] = res.data.data;
      setMembers(data);
    } catch (error) {
      toast.error("Gagl menambahkan data peserta");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  return (
    <>
      <div className="flex flex-col justify-between gap-2 mb-2">
        <NewMemberForm
          organizationId={organizationId}
          onCreate={(member) => {
            setMembers((prev) => [...prev, member]);
          }}
        />

        <Input
          placeholder="Cari peserta..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>

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

      <Pagination
        goLeft={() => table.previousPage()}
        goRight={() => table.nextPage()}
        leftButtonDisabled={!table.getCanPreviousPage()}
        rightButtonDisabled={!table.getCanNextPage()}
      />
    </>
  );
};
