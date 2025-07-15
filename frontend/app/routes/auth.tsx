import { Outlet, redirect } from "react-router";
import { ACCESS_TOKEN } from "~/api/constants";

export async function clientLoader() {
  const token = sessionStorage.getItem(ACCESS_TOKEN);
  if (token) {
    redirect("/");
  }
  return null;
}

export default function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
