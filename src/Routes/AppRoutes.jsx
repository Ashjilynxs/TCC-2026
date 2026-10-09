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
import RecuperarSenha from "../Pages/RecuperarSenha/RecuperarSenha";
import DashboardPsi from "../Pages/DashboardPsi/DashboardPsi";
import Suporte from "../Pages/Suporte/Suporte";
import Sobre_nos from "../Pages/Sobre_nos/Sobre_nos";
import Agenda_psicologo from "../Pages/Agenda_psicologo/Agenda_psicologo";
import { DashboardADM } from "../Pages/DashboardADM/DashboardADM";

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
        path="/psicologo"
        element={<DashboardPsi />}
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
      <Route
        path="/esquecerSenha"
        element={<RecuperarSenha />}
      />
      <Route
        path="/suporte"
        element={<Suporte />}
      />
      <Route
        path="/sobre_nos"
        element={<Sobre_nos />}
      />
      <Route
        path="/agenda_psicologo"
        element={<Agenda_psicologo />}
      />
      <Route
        path="/adm"
        element={<DashboardADM />}
      />
    </Routes>
  );
}

export default AppRoutes;