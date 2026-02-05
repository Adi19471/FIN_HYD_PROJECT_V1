import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";
import "./App.css";

import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import LoadingSpinner from "./LoadingSpinner";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/unauthorized";

  const routesTree = (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ✅ Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {routes.map((route, index) => {
          if (route.path === "/login" || route.public) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<route.element />}
              />
            );
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute allowedRoles={route.roles}>
                  <route.element />
                </PrivateRoute>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );

  return isAuthRoute ? routesTree : <Layout>{routesTree}</Layout>;
}

export default App;
