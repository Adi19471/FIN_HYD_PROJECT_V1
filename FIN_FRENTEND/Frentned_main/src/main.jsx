import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ThemeProvider from "./utils/ThemeContext";
import { AuthProvider } from "./utils/AuthContext";
import App from "./App";




import "@fontsource-variable/inter"; // This imports ALL weights + CSS variables



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <App />
          <ToastContainer />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
