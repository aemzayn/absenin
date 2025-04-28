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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
      <Outlet />
    </div>
  );
}
