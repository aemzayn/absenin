import { Link } from "react-router";

export function meta() {
  return [{ title: "Home" }];
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      Welcome
      <div className="mt-4 flex flex-col gap-4">
        <Link to="/members" className="text-blue-500 hover:underline">
          Go to Members
        </Link>

        <Link to="/scanner" className="text-blue-500 hover:underline">
          Go to Scanner
        </Link>
      </div>
    </div>
  );
}
