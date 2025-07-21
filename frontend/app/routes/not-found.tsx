import { NotFound } from "~/components/ui/not-found/NotFound";

export const meta = () => {
  return [{ title: "Halaman tidak ditemukan" }];
};

export default function NotFoundRoutes() {
  return <NotFound />;
}
