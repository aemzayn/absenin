import { NotFound } from "~/components/ui/not-found";

export const meta = () => {
  return [{ title: "Halaman tidak ditemukan" }];
};

export default function NotFoundPage() {
  return (
    <div>
      <NotFound />
    </div>
  );
}
