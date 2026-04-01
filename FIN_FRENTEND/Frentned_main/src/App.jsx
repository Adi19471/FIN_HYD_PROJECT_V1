import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";
import "./App.css";

import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./utils/AuthContext";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  /* =========================
     Scroll to Top on Route Change
  ========================== */
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0 });
    document.documentElement.style.scrollBehavior = "smooth";
  }, [location.pathname]);

  /* =========================
     Dynamic Title Rotation
  ========================== */
  useEffect(() => {
    const titles = [
      "💰 Sri Balaji Finance",
      "✅ Safe • ⚡ Fast • 🔒 Reliable",
      "📅 Daily Chit Funds Available",
      "🗓️ Monthly Chit Schemes",
      "🤝 Trusted Chit Fund Services",
      "📈 Smart Savings • Better Returns",
      "🏦 Secure Finance Solutions",
    ];

    let index = 0;

    const interval = setInterval(() => {
      document.title = titles[index];
      index = (index + 1) % titles.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     Route Conditions
  ========================== */
  const isAuthPage = ["/login", "/unauthorized"].includes(location.pathname);

  /* =========================
     Route Builder
  ========================== */
  const renderRoutes = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map((route, index) => {
          const Element = route.element;

          // 🔹 Public Routes
          if (route.public || route.path === "/login") {
            return <Route key={index} path={route.path} element={<Element />} />;
          }

          // 🔹 Root Route ("/")
          if (route.path === "/") {
            return (
              <Route
                key={index}
                path="/"
                element={
                  isAuthenticated ? (
                    <PrivateRoute>
                      <Element />
                    </PrivateRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            );
          }

          // 🔹 Protected Routes with Role
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute allowedRoles={route.roles}>
                  <Element />
                </PrivateRoute>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );

  /* =========================
     Layout Handling
  ========================== */
  return isAuthPage ? renderRoutes() : <Layout>{renderRoutes()}</Layout>;
}

export default App;