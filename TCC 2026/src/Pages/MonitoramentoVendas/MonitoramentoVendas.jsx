
import { useState } from "react";
import styles from "./MonitoramentoVendas.module.css";
import SidebarA from "../../Components/SidebarA/SidebarA";
import NavbarAdm from "../../Components/NavbarA/NavbarAdm";

const pedidosIniciais = [
  {
    id: "ORD-9281",
    data: "Hoje, 10:20",
    vendedora: "Beatriz Santos",
    total: 159.90,
    status: "concluido"
  },
  {
    id: "ORD-9280",
    data: "Hoje, 09:15",
    vendedora: "Daniela Lima",
    total: 89.00,
    status: "processando"
  },
  {
    id: "ORD-9279",
    data: "Ontem, 16:45",
    vendedora: "Beatriz Santos",
    total: 210.00,
    status: "concluido"
  },
  {
    id: "ORD-9278",
    data: "Ontem, 14:30",
    vendedora: "Elaine Rocha",
    total: 45.50,
    status: "cancelado"
  },
  {
    id: "ORD-9277",
    data: "22 Mar, 11:20",
    vendedora: "Daniela Lima",
    total: 120.00,
    status: "concluido"
  }
];

function MonitoramentoVendas() {
  const [pedidos] = useState(pedidosIniciais);
  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  const faturamento = pedidos
    .filter((pedido) => pedido.status !== "cancelado")
    .reduce((total, pedido) => total + pedido.total, 0);

  const comissao = faturamento * 0.10;

  const vendasPorVendedora = Object.values(
    pedidos
      .filter((pedido) => pedido.status !== "cancelado")
      .reduce((resultado, pedido) => {
        if (!resultado[pedido.vendedora]) {
          resultado[pedido.vendedora] = {
            nome: pedido.vendedora,
            total: 0
          };
        }

        resultado[pedido.vendedora].total += pedido.total;

        return resultado;
      }, {})
  ).sort((a, b) => b.total - a.total);

  const maiorVenda = Math.max(
    ...vendasPorVendedora.map((item) => item.total),
    1
  );

  return (
    <>
    <SidebarA />
    <main className={styles.main}>
      <NavbarAdm />
      <header className={styles.cabecalho}>
        <div>
          <h1>Monitoramento de Vendas</h1>
          <p>Acompanhe o fluxo financeiro e comissões (10%).</p>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.tabelaContainer}>
          <div className={styles.tabelaScroll}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>PEDIDO</th>
                  <th>VENDEDORA</th>
                  <th>TOTAL</th>
                  <th>COMISSÃO (10%)</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <strong>{pedido.id}</strong>
                      <small>{pedido.data}</small>
                    </td>

                    <td>
                      <span>{pedido.vendedora}</span>
                    </td>

                    <td>
                      <strong>
                        {formatarMoeda(pedido.total)}
                      </strong>
                    </td>

                    <td className={styles.comissao}>
                      {formatarMoeda(pedido.total * 0.10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className={styles.resumo}>
          <div className={styles.cardFaturamento}>
            <div className={styles.cardTopo}>
              <span>Faturamento Marketplace</span>
              <i className="bi bi-graph-up-arrow"></i>
            </div>

            <h2>{formatarMoeda(faturamento)}</h2>

            <p>Volume total de vendas no mês</p>
          </div>

          <div className={styles.cardReceita}>
            <div className={styles.cardTopo}>
              <span>Receita Instituto (10%)</span>
              <i className="bi bi-currency-dollar"></i>
            </div>

            <h2>{formatarMoeda(comissao)}</h2>

            <p>Valor disponível para reinvestimento</p>
          </div>
        </aside>
      </div>
    </main>
    </>
  );
}

export default MonitoramentoVendas;
