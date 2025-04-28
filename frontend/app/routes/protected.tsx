import { requireAuth } from "~/api/auth";

import { useState } from "react";
import { FaBars, FaHome, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { Outlet, redirect } from "react-router";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = () => {
    sessionStorage.removeItem("access_token");
    redirect("/login");
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center p-4 bg-white shadow-md">
        <button
          className="text-xl mr-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold">Home</h1>
      </nav>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-blue-100 shadow-lg z-50">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <button
                className="flex items-center w-full p-4 hover:bg-blue-200"
                onClick={() => redirect("/")}
              >
                <FaHome className="mr-3" />
                Home
              </button>
              <button
                className="flex items-center w-full p-4 hover:bg-blue-200"
                onClick={() => redirect("/events")}
              >
                <FaCalendarAlt className="mr-3" />
                Events
              </button>
            </div>
            <button
              className="flex items-center w-full p-4 text-red-600 hover:bg-red-100"
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Outlet />
    </div>
  );
}
