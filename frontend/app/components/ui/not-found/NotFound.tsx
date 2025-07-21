import { useNavigate } from "react-router";
import { HomeIcon } from "lucide-react";
import { Button } from "primereact/button";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Kamu tersesat</h1>
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
