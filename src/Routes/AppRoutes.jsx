import { Routes, Route } from "react-router-dom";

import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";
import Perfil from "../Pages/Perfil/Perfil"
import Carrinho from "../Pages/Carrinho/Carrinho"

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

      <Route
        path="/carrinho"
        element={<Carrinho />}
      />
      </Routes>
  );
}

export default AppRoutes;