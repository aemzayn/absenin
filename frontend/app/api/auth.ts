import { redirect } from "react-router";

export function requireAuth() {
  const accessToken = window.sessionStorage.getItem("access_token");
  if (!accessToken) {
    throw redirect("/login");
  }
}
