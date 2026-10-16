
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "../Pages/Dashboard/Dashboard";
import DashboardLogado from "../Pages/DashboardLogado/DashboardLogado";
import Perfil from "../Pages/Perfil/Perfil";
import PerfilV from "../Pages/PerfilV/PerfilV";
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
import ConfirmarEmail from "../Pages/ConfirmarEmail/ConfirmarEmail";
import DashboardPsi from "../Pages/DashboardPsi/DashboardPsi";
import Suporte from "../Pages/Suporte/Suporte";
import Sobre_nos from "../Pages/Sobre_nos/Sobre_nos";
import Agenda_psicologo from "../Pages/Agenda_psicologo/Agenda_psicologo";
import DashboardADM from "../Pages/DashboardADM/DashboardADM";
import ComeceEmpreender from "../Pages/ComeceEmpreender/ComeceEmpreender";
import DetalhesProduto from "../Pages/DetalhesProduto/DetalhesProduto";
import GerenciarAgendamentos from "../Pages/GerenciarAgendamentos/GerenciarAgendamentos";
import LayoutLogado from "../Components/LayoutLogado";
import MonitoramentoVendas from "../Pages/MonitoramentoVendas/MonitoramentoVendas";
import Usuarios from "../Pages/Usuarios/Usuarios";
import Verificacao from "../Pages/Verificacao/Verificacao";
import Psicologos from "../Pages/Psicologos/Psicologos";

function AppRoutes() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        if (ativo) {
          setCarregando(true);
          setErroConexao(false);
        }

        const resposta = await fetch(
          "http://localhost:8080/usuarios/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (resposta.status === 401) {
          if (ativo) {
            setUsuario(null);
          }
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            `Erro HTTP ${resposta.status} ao consultar o usuário`
          );
        }

        const tipo =
          resposta.headers.get("content-type") || "";

        if (!tipo.includes("application/json")) {
          throw new Error(
            "A API não retornou JSON."
          );
        }

        const dados = await resposta.json();

        if (ativo) {
          // Mantém o usuário autenticado.
          // Não colocar setUsuario(null) aqui!
          setUsuario(dados);
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar usuário:",
          erro
        );

        if (ativo) {
          setErroConexao(true);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuario();

    window.addEventListener(
      "usuarioAtualizado",
      carregarUsuario
    );

    return () => {
      ativo = false;

      window.removeEventListener(
        "usuarioAtualizado",
        carregarUsuario
      );
    };
  }, []);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erroConexao) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Não foi possível conectar ao servidor</h2>

        <p>
          Verifique se o backend está funcionando.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

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
        path="/cursos"
        element={<Cursos />}
      />

      <Route
        path="/qSvoluntario"
        element={<QueroSerVoluntario />}
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
        path="/confirmar-email"
        element={<ConfirmarEmail />}
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

      <Route
        path="/comeceEmpreender"
        element={<ComeceEmpreender />}
      />

      <Route
        path="/produto/:id"
        element={<DetalhesProduto />}
      />

      <Route
        path="/gerenciarAgendamento"
        element={<GerenciarAgendamentos />}
      />

      <Route
        path="/perfilV"
        element={<PerfilV />}
      />

      <Route
        path="/monitoramentoVendas"
        element={<MonitoramentoVendas />}
      />

      {/* PÁGINAS COM SIDEBAR DINÂMICA */}

      <Route
        element={
          <LayoutLogado
            nivelAcesso={usuario?.nivelAcesso}
          />
        }
      >
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
          path="/suporte"
          element={<Suporte />}
        />

        <Route
          path="/meusPedidos"
          element={<MeusPedidos />}
        />
      </Route>

      <Route
        path="/usuarios"
        element={<Usuarios />}
      />

      <Route
        path="/verificacao"
        element={<Verificacao />}
      />

      <Route
        path="/psicologos"
        element={<Psicologos />}
      />
    </Routes>
  );
}

export default AppRoutes;
