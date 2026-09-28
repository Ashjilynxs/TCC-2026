import { Routes, Route } from "react-router-dom";

import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";
import Perfil from "../Pages/Perfil/Perfil"

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<DashboardLogado />}
      />

      <Route
        path="/perfil"
        element={<Perfil />}
      />
      </Routes>
  );
}

export default AppRoutes;