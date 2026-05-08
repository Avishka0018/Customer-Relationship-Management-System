// Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";

function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  const baseStyle =
    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200";

  const activeStyle = "bg-gray-800 text-white";
  const normalStyle =
    "hover:bg-gray-800 text-gray-300";

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900 text-white transition-all duration-300 overflow-hidden
      ${collapsed ? "w-20" : "w-64"}`}
    >

      {/* Added top spacing */}
      <nav className="p-3 pt-8 space-y-3">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive ? activeStyle : normalStyle
            }`
          }
        >
          <LayoutDashboard size={20} />

          {!collapsed && (
            <span className="font-medium">
              Dashboard
            </span>
          )}
        </NavLink>

        {/* Leads */}
        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive ? activeStyle : normalStyle
            }`
          }
        >
          <Users size={20} />

          {!collapsed && (
            <span className="font-medium">
              Leads
            </span>
          )}
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`${baseStyle} ${normalStyle} w-full mt-6`}
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className="font-medium">
              Logout
            </span>
          )}
        </button>

      </nav>
    </aside>
  );
}

export default Sidebar;