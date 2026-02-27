import React from "react";
import "./CopyrightFooter.css";

export default function CopyrightFooter({
  // company = "Balaji Finance",
  className = "",
}) {
  const year = new Date().getFullYear();
  return (
    <footer className={`bf-footer ${className || ""}`}>
      <div className="bf-footer-inner">
        <span>
          © {year} {company}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
