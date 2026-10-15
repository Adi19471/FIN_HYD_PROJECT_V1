import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import TopNav from "../partials/TopNav";
import { useThemeProvider } from "../utils/ThemeContext";
import { motion } from "framer-motion";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useThemeProvider();

  // Shell height comes from .enterprise-shell (zoom-aware), not h-screen.

  return (
    <div className="enterprise-shell flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* One sticky block, so the horizontal menu rides under the top bar
            whatever height the bar's style gives it. */}
        <div className="enterprise-topstack">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {settings.navLayout === "horizontal" && <TopNav />}
        </div>

        <main className="grow enterprise-main">
          {/* every screen sits inside the same margin, instead of flush against the menu */}
          <div className="enterprise-page">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
