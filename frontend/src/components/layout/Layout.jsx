// Layout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  // Sidebar collapsed by default
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* Navbar */}
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Sidebar + Content */}
      <div className="flex pt-16 min-h-screen">

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 p-6 overflow-x-auto ${
            collapsed ? "ml-20" : "ml-64"
          }`}
        >
          {children}
        </main>

      </div>
    </div>
  );
}

export default Layout;