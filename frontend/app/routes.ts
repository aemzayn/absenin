import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/protected.tsx", [
    index("routes/home.tsx"),
    route("members", "routes/members.tsx"),
    route("scanner", "routes/scanner.tsx"),

    ...prefix("event", [
      route(":eventId", "routes/event.tsx"),
      route(":eventId/attendees", "routes/event-attendees.tsx"),
      route(":eventId/scan", "routes/event-qr-scanner.tsx"),
    ]),

    route("organization", "routes/organization.tsx", []),

    // ...prefix("organization", [
    // index("routes/organization.tsx"),
    // route(":organizationId", "routes/organization.tsx"),
    // route(":organizationId/members", "routes/organization-members.tsx"),
    // route(":organizationId/events", "routes/organization-events.tsx"),
    // ]),
  ]),

  layout("routes/auth.tsx", [
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
  ]),
] satisfies RouteConfig;
