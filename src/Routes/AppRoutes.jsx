import { Routes, Route } from "react-router-dom";

import Dashboard from "../Pages/Dashboard/Dashboard";
import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";
import Perfil from "../Pages/Perfil/Perfil";
import Carrinho from "../Pages/Carrinho/Carrinho";
import Catalogo from "../Pages/Catalogo/Catalogo";
import Cursos from "../Pages/Cursos/Cursos";
import QueroSerVoluntario from "../Pages/QueroSerVoluntario/QueroSerVoluntario";
import MeusPedidos from "../Pages/Meus pedidos/MeusPedidos";
import DashboardVendedora from "../Pages/DashboardVendedora/DashboardVendedora";
import GerenciarLoja from "../Pages/GerenciarLoja/GerenciarLoja";
import Login from "../Pages/Login/Login";
import Cadastrar from "../Pages/Cadastre-se/Cadastrar";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />
      <Route
        path="/Logado"
        element={<DashboardLogado />}
      />

      <Route
        path="/vendedora"
        element={<DashboardVendedora />}
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
      <Route
        path="/gerenciarLoja"
        element={<GerenciarLoja />}
      />
      <Route
      path="/login"
      element={<Login />}
      />
      <Route
        path="/cadastrar"
        element={<Cadastrar />}
      />
      </Routes>
  );
}

export default AppRoutes;