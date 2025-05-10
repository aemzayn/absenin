import { isValidElement, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { QrCodeIcon } from "lucide-react";
import { downloadQRCode } from "~/lib/download-qr";
import { usePagination } from "~/hooks/use-pagination";
import { Pagination } from "./pagination";

type Props = {
  organizationId: number;
};

type MemberCandidate = Pick<Member, "name">[];

export const MembersTable = ({ organizationId }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [candidates, setCandidates] = useState<MemberCandidate>([]);
  const [loading, setLoading] = useState(false);
  const [editingMembers, setEditingMembers] = useState<{
    [key: number]: Member;
  }>({});

  const { currentData, currentPage, totalPages, goLeft, goRight } =
    usePagination(members);

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

  const handleSaveMember = async (
    member: Partial<Member>,
    rowIndex: number
  ) => {
    if (!organizationId) return;
    try {
      const res = await MembersService.createMembers(organizationId, [member]);
      const data: Member[] = res.data.data;

      setMembers((prev) => [...prev, ...data]);
      setCandidates((prev) => prev.filter((_, index) => index !== rowIndex));
      toast.success("Peserta berhasil ditambahkan");
    } catch (error) {
      toast.error("Gagal menambahkan peserta");
    }
  };

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

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <Button
          className="bg-blue-200"
          onClick={() => {
            const newCandidates = [...candidates, { name: "" }];
            setCandidates(newCandidates);
          }}
          size={"sm"}
        >
          Tambah Peserta
        </Button>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow className="bg-blue-500 hover:bg-blue-500">
            <TableHead>Nama</TableHead>
            <TableHead className="text-center">QR code</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {candidates.map((candidate, index) => {
            return (
              <TableRow key={index} className="bg-blue-200 hover:bg-blue-300">
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-300 rounded p-2"
                    size={5}
                    minLength={3}
                    maxLength={255}
                    value={candidate.name}
                    onChange={(e) => {
                      const newCandidates = [...candidates];
                      newCandidates[index].name = e.target.value;
                      setCandidates(newCandidates);
                    }}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => {
                        handleSaveMember(candidate, index);
                      }}
                      disabled={
                        !candidate.name ||
                        candidate.name.length < 3 ||
                        candidate.name.length > 255 ||
                        loading
                      }
                      className="bg-green-500 disabled:bg-gray-400"
                    >
                      Simpan
                    </Button>
                    <Button
                      className="bg-red-400"
                      onClick={() => {
                        const newCandidates = candidates.filter(
                          (_, i) => i !== index
                        );
                        setCandidates(newCandidates);
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {currentData.map((member: Member) => (
            <TableRow key={member.id} className="bg-blue-200 hover:bg-blue-300">
              <TableCell>
                {editingMembers[member.id] ? (
                  <Input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-300 rounded p-2"
                    size={5}
                    minLength={3}
                    maxLength={255}
                    value={editingMembers[member.id].name}
                    onChange={(e) => {
                      setEditingMembers((prev) => ({
                        ...prev,
                        [member.id]: {
                          ...prev[member.id],
                          name: e.target.value,
                        },
                      }));
                    }}
                  />
                ) : (
                  member.name
                )}
              </TableCell>

              <TableCell className="text-center">
                <Button
                  size={"sm"}
                  variant={"neutral"}
                  onClick={() => handleDownloadQrCode(member)}
                >
                  Download <QrCodeIcon />
                </Button>
              </TableCell>

              <TableCell className="text-right max-w-[50px]">
                <div className="flex gap-2 justify-end">
                  {editingMembers[member.id] ? (
                    <>
                      <Button
                        disabled={loading}
                        onClick={() => {
                          setEditingMembers((prev) => {
                            delete prev[member.id];
                            return { ...prev };
                          });
                        }}
                        size={"sm"}
                        className="bg-gray-200"
                      >
                        Batal
                      </Button>
                      <Button
                        disabled={loading}
                        onClick={() => {
                          handleUpdateMember(editingMembers[member.id]);
                        }}
                        size={"sm"}
                        className="bg-green-400"
                      >
                        Simpan
                      </Button>
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
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingMembers((prev) => {
                          prev[member.id] = member;
                          return { ...prev };
                        });
                      }}
                      size={"sm"}
                      className="bg-blue-500"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goLeft={goLeft}
                goRight={goRight}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
