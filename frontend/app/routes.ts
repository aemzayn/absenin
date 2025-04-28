import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/protected.tsx", [
    index("routes/home.tsx"),
    route("members", "routes/members.tsx"),
    route("scanner", "routes/scanner.tsx"),
  ]),

  layout("routes/auth.tsx", [
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
  ]),
] satisfies RouteConfig;
