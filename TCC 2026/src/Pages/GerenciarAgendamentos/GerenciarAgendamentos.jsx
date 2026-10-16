
import { useState } from "react";
import styles from "./GerenciarAgendamentos.module.css";
import SidebarP from "../../Components/SidebarP/SidebarP";

const consultasIniciais = [
  {
    id: 1,
    paciente: "Ana Paula Silva",
    data: "2026-10-15",
    horario: "14:00",
    status: "Pendente",
  },
  {
    id: 2,
    paciente: "Carla Oliveira",
    data: "2026-10-16",
    horario: "09:00",
    status: "Pendente",
  },
  {
    id: 3,
    paciente: "Mariana Souza",
    data: "2026-10-17",
    horario: "10:30",
    status: "Confirmado",
  },
];

const diasSemana = [
  { id: "segunda", nome: "Segunda-feira" },
  { id: "terca", nome: "Terça-feira" },
  { id: "quarta", nome: "Quarta-feira" },
  { id: "quinta", nome: "Quinta-feira" },
  { id: "sexta", nome: "Sexta-feira" },
  { id: "sabado", nome: "Sábado" },
];

const horarios = Array.from({ length: 25 }, (_, index) => {
  const hora = String(Math.floor(index / 2) + 7).padStart(2, "0");
  const minuto = index % 2 === 0 ? "00" : "30";
  return `${hora}:${minuto}`;
});

function GerenciarAgendamentos() {
  const [consultas, setConsultas] = useState(consultasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [configuracao, setConfiguracao] = useState({
    dias: ["segunda", "terca", "quarta", "quinta", "sexta"],
    inicio: "08:00",
    fim: "18:00",
    duracao: "50",
  });

  const [formAgenda, setFormAgenda] = useState(configuracao);

  function atualizarStatus(id, novoStatus) {
    setConsultas((anteriores) =>
      anteriores.map((consulta) =>
        consulta.id === id
          ? { ...consulta, status: novoStatus }
          : consulta
      )
    );
  }

  function abrirModal() {
    setFormAgenda({
      ...configuracao,
      dias: [...configuracao.dias],
    });
    setMensagem("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setMensagem("");
  }

  function alterarDia(dia) {
    setFormAgenda((anterior) => ({
      ...anterior,
      dias: anterior.dias.includes(dia)
        ? anterior.dias.filter((item) => item !== dia)
        : [...anterior.dias, dia],
    }));
  }

  function salvarAgenda(evento) {
    evento.preventDefault();

    if (formAgenda.dias.length === 0) {
      setMensagem("Selecione pelo menos um dia disponível.");
      return;
    }

    if (formAgenda.inicio >= formAgenda.fim) {
      setMensagem(
        "O fim do expediente deve ser depois do início."
      );
      return;
    }

    setConfiguracao({
      ...formAgenda,
      dias: [...formAgenda.dias],
    });

    fecharModal();
  }

  function formatarData(data) {
    return new Date(`${data}T12:00:00`).toLocaleDateString(
      "pt-BR"
    );
  }

  return (
    <>
    <SidebarP />
    <main className={styles.pagina}>
      <div className={styles.container}>
        <header className={styles.cabecalho}>
          <div>
            <h1>Gestão de Consultas</h1>
            <p>
              Gerencie seus horários, pacientes e sessões agendadas.
            </p>
          </div>

          <button
            type="button"
            className={styles.botaoAgenda}
            onClick={abrirModal}
          >
            <i className="bi bi-calendar-week"></i>
            Configurar Agenda
          </button>
        </header>

        <section className={styles.listaConsultas}>
          <h2>Consultas Agendadas</h2>

          {consultas.length === 0 ? (
            <p className={styles.semConsultas}>
              Nenhuma consulta agendada.
            </p>
          ) : (
            consultas.map((consulta) => (
              <article
                key={consulta.id}
                className={styles.cardConsulta}
              >
                <div className={styles.paciente}>
                  <div className={styles.avatar}>
                    <i className="bi bi-person"></i>
                  </div>

                  <div className={styles.dadosPaciente}>
                    <h3>{consulta.paciente}</h3>

                    <div className={styles.dataHorario}>
                      <span>
                        <i className="bi bi-calendar3"></i>
                        {formatarData(consulta.data)}
                      </span>

                      <span>
                        <i className="bi bi-clock"></i>
                        {consulta.horario}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.acoes}>
                  <span
                    className={`${styles.status} ${
                      consulta.status === "Confirmado"
                        ? styles.confirmado
                        : consulta.status === "Cancelado"
                        ? styles.cancelado
                        : styles.pendente
                    }`}
                  >
                    {consulta.status}
                  </span>

                  {consulta.status === "Pendente" && (
                    <>
                      <button
                        type="button"
                        className={styles.botaoConfirmar}
                        onClick={() =>
                          atualizarStatus(consulta.id, "Confirmado")
                        }
                      >
                        <i className="bi bi-check-lg"></i>
                        Confirmar
                      </button>

                      <button
                        type="button"
                        className={styles.botaoCancelar}
                        onClick={() =>
                          atualizarStatus(consulta.id, "Cancelado")
                        }
                      >
                        <i className="bi bi-x-lg"></i>
                        Cancelar
                      </button>
                    </>
                  )}

                  {consulta.status === "Confirmado" && (
                    <button
                      type="button"
                      className={styles.botaoCancelar}
                      onClick={() =>
                        atualizarStatus(consulta.id, "Cancelado")
                      }
                    >
                      <i className="bi bi-x-lg"></i>
                      Cancelar
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {modalAberto && (
        <div
          className={styles.overlay}
          onClick={fecharModal}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalAgenda"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className={styles.modalCabecalho}>
              <div>
                <h2 id="tituloModalAgenda">
                  Configurar Agenda de Atendimento
                </h2>
                <p>
                  Defina seus dias e horários disponíveis para
                  novos agendamentos.
                </p>
              </div>

              <button
                type="button"
                className={styles.fechar}
                onClick={fecharModal}
                aria-label="Fechar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={salvarAgenda}>
              <div className={styles.campo}>
                <label>Dias Disponíveis</label>

                <div className={styles.diasGrid}>
                  {diasSemana.map((dia) => (
                    <label
                      key={dia.id}
                      className={styles.opcaoDia}
                    >
                      <input
                        type="checkbox"
                        checked={formAgenda.dias.includes(dia.id)}
                        onChange={() => alterarDia(dia.id)}
                      />
                      <span>{dia.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.horariosGrid}>
                <div className={styles.campo}>
                  <label htmlFor="inicioExpediente">
                    Início do Expediente
                  </label>

                  <select
                    id="inicioExpediente"
                    value={formAgenda.inicio}
                    onChange={(evento) =>
                      setFormAgenda({
                        ...formAgenda,
                        inicio: evento.target.value,
                      })
                    }
                  >
                    {horarios.map((horario) => (
                      <option key={horario} value={horario}>
                        {horario}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="fimExpediente">
                    Fim do Expediente
                  </label>

                  <select
                    id="fimExpediente"
                    value={formAgenda.fim}
                    onChange={(evento) =>
                      setFormAgenda({
                        ...formAgenda,
                        fim: evento.target.value,
                      })
                    }
                  >
                    {horarios.map((horario) => (
                      <option key={horario} value={horario}>
                        {horario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.campo}>
                <label htmlFor="duracaoSessao">
                  Duração da Sessão (minutos)
                </label>

                <select
                  id="duracaoSessao"
                  value={formAgenda.duracao}
                  onChange={(evento) =>
                    setFormAgenda({
                      ...formAgenda,
                      duracao: evento.target.value,
                    })
                  }
                >
                  <option value="30">30 minutos</option>
                  <option value="40">40 minutos</option>
                  <option value="50">50 minutos</option>
                  <option value="60">60 minutos</option>
                  <option value="90">90 minutos</option>
                </select>
              </div>

              {mensagem && (
                <p className={styles.mensagemErro}>
                  {mensagem}
                </p>
              )}

              <div className={styles.modalRodape}>
                <button
                  type="button"
                  className={styles.botaoVoltar}
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={styles.botaoSalvar}
                >
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
    </>
  );
}

export default GerenciarAgendamentos;
