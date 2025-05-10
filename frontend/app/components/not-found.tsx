import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Kamu tersesat</h1>
      <p>
        Tidak ada kehidupan disini. Apapun itu mungkin sudah dihapus atau memang
        tidak pernah ada
      </p>
      <Button onClick={handleHomeClick}>
        Kembali ke halaman awal
        <HomeIcon />
      </Button>
    </div>
  );
};
