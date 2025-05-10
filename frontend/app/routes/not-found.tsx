import { NotFound } from "~/components/not-found";

export const meta = () => {
  return [{ title: "Halaman tidak ditemukan" }];
};

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <NotFound />
    </div>
  );
}
