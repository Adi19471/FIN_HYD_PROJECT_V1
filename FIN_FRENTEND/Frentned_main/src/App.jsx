import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
  }, [location.pathname]); // triggered on route change

  // Render login (and other public routes) without the app chrome/layout
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/unauthorized";

  const routesTree = (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map((route, index) => {
          if (route.path === "/login" || route.public) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<route.element />}
                exact={route.exact}
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
              exact={route.exact}
            />
          );
        })}
      </Routes>
    </Suspense>
  );

  return isAuthRoute ? routesTree : <Layout>{routesTree}</Layout>;
}

export default App;
