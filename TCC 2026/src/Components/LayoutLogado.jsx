
import { Outlet } from "react-router-dom";

import SidebarUser from "./Sidebar/Sidebar";
import SidebarV from "./SidebarV/SidebarV";
import SidebarP from "./SidebarP/SidebarP";

function LayoutLogado({ nivelAcesso }) {
  // AppRoutes envia a prop `nivelAcesso` (string ex.: "USER,VENDEDORA").
  const niveis = String(nivelAcesso ?? "")
    .split(",")
    .map((nivel) => nivel.trim().toUpperCase())
    .filter(Boolean);

  console.log("NÍVEIS NO LAYOUT:", niveis);

  return (
    <>
      {niveis.includes("VENDEDORA") ? (
        <SidebarV />
      ) : niveis.includes("PSICOLOGO") ? (
        <SidebarP />
      ) : niveis.includes("USER") ? (
        <SidebarUser />
      ) : (
        <p>Não foi possível identificar o nível de acesso.</p>
      )}

      <Outlet />
    </>
  );
}

export default LayoutLogado;
