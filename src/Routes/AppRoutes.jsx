import { Routes, Route } from "react-router-dom";

import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";
import Perfil from "../Pages/Perfil/Perfil";
import Carrinho from "../Pages/Carrinho/Carrinho";
import Catalogo from "../Pages/Catalogo/Catalogo";
import Mensagens from "../Pages/Mensagens/Mensagens";
import Cursos from "../Pages/Cursos/Cursos";
import QueroSerVoluntario from "../Pages/QueroSerVoluntario/QueroSerVoluntario";
import MeusPedidos from "../Pages/Meus pedidos/MeusPedidos";
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
      
      <Route
        path="/catalogo"
        element={<Catalogo />}
      />

      <Route
        path="/mensagens"
        element={<Mensagens />}
      />

      <Route
        path="/cursos"
        element={<Cursos />}
      />

      <Route
        path="/qSvoluntario"
        element={<QueroSerVoluntario />}
      />
      <Route
        path="/meusPedidos"
        element={<MeusPedidos />}
      />
      </Routes>
  );
}

export default AppRoutes;