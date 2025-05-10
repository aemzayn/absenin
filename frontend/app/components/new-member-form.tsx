import { useRef, useState } from "react";
import { Form } from "react-router";
import { Button } from "./ui/button";
import { Spinner } from "./icons/spinner";
import { Input } from "./ui/input";
import type { Member } from "~/interfaces/member";
import { MembersService } from "~/services/members.service";
import { toast } from "sonner";

type Props = {
  organizationId: number;
  onCreate?: (member: Member) => void;
};

export const NewMemberForm = ({ organizationId, onCreate }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;

      const res = await MembersService.createMember(organizationId, {
        name,
      });

      const member: Member = res.data.data;
      onCreate?.(member);
      toast.success("Peserta berhasil ditambahkan");

      // Reset the form
      formRef.current?.reset();
    } catch (error) {
      console.error("Error creating member:", error);
      toast.error("Gagal menambahkan peserta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleCreate} ref={formRef}>
      <div className="flex items-center gap-2">
        <Input
          id="name"
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={100}
          disabled={submitting}
          placeholder="Masukkan nama peserta"
        />

        <Button variant={"noShadow"} type="submit" disabled={submitting}>
          {submitting ? (
            <>
              Sedang menambahkan...
              <Spinner />
            </>
          ) : (
            "Tambah peserta"
          )}
        </Button>
      </div>
    </Form>
  );
};
