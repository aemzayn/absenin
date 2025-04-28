import { redirect } from "react-router";
import { ACCESS_TOKEN } from "./constants";

export function requireAuth() {
  const accessToken = window.sessionStorage.getItem(ACCESS_TOKEN);
  if (!accessToken) {
    throw redirect("/login");
  }
}
