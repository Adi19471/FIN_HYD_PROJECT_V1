import React, { useState } from "react";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10">
        {/* Premium Glass Backdrop + Animated Particles */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl" />
        <div
          className="absolute inset-0 opacity-35 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 70%, #ffd700 1px, transparent 2px),
              radial-gradient(circle at 85% 30%, #53e3a6 1px, transparent 2px),
              radial-gradient(circle at 45% 50%, #00d4ff 1px, transparent 2px)
            `,
            backgroundSize: "200px 200px",
            animation: "float 32s ease-in-out infinite"
          }}
        />

        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo & Mobile Menu */}
            <div className="flex items-center space-x-6">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-yellow-500/20 hover:border-yellow-400/60 transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Brand Logo + Name */}
              <div className="flex items-center space-x-4">
                {/* Golden Logo */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl ring-4 ring-yellow-400/30">
                    <span className="text-black font-black text-xl tracking-tighter">BF</span>
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-yellow-400/30 blur-2xl animate-pulse"></div>
                </div>

                {/* Brand Text */}
                <div>
                  <h1 className="text-2xl font-black tracking-tighter">
                    <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                      BALAJI
                    </span>{" "}
                    <span className="text-white">FINANCE</span>
                  </h1>
                  <p className="text-xs text-yellow-400/80 font-semibold tracking-wider">Premium Banking Dashboard</p>
                </div>
              </div>
            </div>

            {/* Right Side - All Actions (100% Functional) */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchModalOpen(true);
                }}
                className={`p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all duration-300 group ${
                  searchModalOpen ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <SearchModal
                id="search-modal"
                modalOpen={searchModalOpen}
                setModalOpen={setSearchModalOpen}
              />

              {/* Notifications */}
              <Notifications align="right" />

              {/* Help */}
              <Help align="right" />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Divider */}
              <div className="w-px h-10 bg-white/20 mx-2" />

              {/* User Menu */}
              <UserMenu align="right" />
            </div>
          </div>
        </div>

        {/* Force All Dropdowns to Match Our Golden Theme */}
        <style jsx global>{`
          /* Dropdown Menus */
          [data-radix-popper-content-wrapper],
          .dropdown-menu,
          [role="menu"],
          [data-headlessui-state~="open"] {
            background: rgba(20, 25, 50, 0.95) !important;
            backdrop-filter: blur(24px) !important;
            border: 1px solid rgba(255, 215, 0, 0.3) !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            margin-top: 12px !important;
          }

          /* Dropdown Items */
          [role="menuitem"],
          .dropdown-item,
          [data-radix-collection-item] {
            color: #e2e8f0 !important;
            padding: 12px 20px !important;
            border-radius: 12px !important;
            transition: all 0.2s ease !important;
          }

          [role="menuitem"]:hover,
          .dropdown-item:hover,
          [data-radix-collection-item]:hover {
            background: rgba(255, 215, 0, 0.2) !important;
            color: #ffd700 !important;
          }

          /* Icons */
          [role="menuitem"] svg,
          .dropdown-item svg {
            color: #ffd700 !important;
          }

          /* Badges */
          .badge, .notification-count {
            background: #ff4444 !important;
            color: white !important;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
        `}</style>
      </header>
    </>
  );
}

export default Header;