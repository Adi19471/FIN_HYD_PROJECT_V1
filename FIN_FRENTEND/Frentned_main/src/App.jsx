import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";
import "./App.css";

import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./utils/authStore";
import { COMPANY_APP_NAME } from "src/lib/company";

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
     Static Browser Title
  ========================== */
  useEffect(() => {
    document.title = COMPANY_APP_NAME;
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
                    <PrivateRoute requiredPermissions={route.permissionCodes}>
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
                <PrivateRoute allowedRoles={route.roles} requiredPermissions={route.permissionCodes}>
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
