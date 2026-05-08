// Navbar.jsx
import { Menu } from "lucide-react";

function Navbar({ collapsed, setCollapsed }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50">

      <div className="h-full flex items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Hamburger */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-bold text-gray-700">
            Customer Relationship Management System
          </h1>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shadow-md">

            <img
              src="https://img.freepik.com/fotos-premium/memoji-cara-bonito-homem-com-oculos-em-um-fundo-branco-emoji-personagem-de-desenho-animado_826801-6961.jpg"
              alt="admin avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

          </div>

          {/* Text */}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;