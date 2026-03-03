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

  // ✅ Scroll Effect
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  // ✅ Title Rotation Effect (ADD HERE)
  useEffect(() => {
    const titles = [
      "💰 Sri Balaji Finance",
      "✅ Safe • ⚡ Fast • 🔒 Reliable",
      "📅 Daily Chit Funds Available",
      "🗓️ Monthly Chit Schemes",
      "🤝 Trusted Chit Fund Services",
      "📈 Smart Savings • Better Returns",
      "🏦 Secure Finance Solutions"
    ];

    let index = 0;

    const interval = setInterval(() => {
      document.title = titles[index];
      index = (index + 1) % titles.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/unauthorized";

  const routesTree = (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map((route, index) => {
          if (route.path === "/") {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  isAuthenticated ? (
                    <PrivateRoute>
                      <route.element />
                    </PrivateRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            );
          }

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