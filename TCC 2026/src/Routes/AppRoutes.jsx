import { Routes, Route } from "react-router-dom";

import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";


function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<DashboardLogado />}
      />
      </Routes>
  );
}

export default AppRoutes;