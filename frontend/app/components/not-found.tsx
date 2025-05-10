import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>404 Not Found</h1>
      <p>The content you are looking for does not exist.</p>
      <Button onClick={handleHomeClick}>Home</Button>
    </div>
  );
};
