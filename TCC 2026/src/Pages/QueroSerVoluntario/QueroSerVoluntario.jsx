import { useEffect, useState } from "react";
import styles from "./QueroSerVoluntario.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";

const API = "http://localhost:8080";

const opcoesEspecialidade = {
  clinica: "Psicologia Clínica",
  social: "Psicologia Social",
  familiar: "Psicologia Familiar",
  outra: "Outra",
};

function QueroSerVoluntario() {
  const [etapa, setEtapa] = useState(1);

  const [nome, setNome] = useState("");
  const [emailProfissional, setEmailProfissional] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [uf, setUf] = useState("");
  const [sobre, setSobre] = useState("");
  const [crp, setCrp] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [modalidade, setModalidade] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  /* O cadastro exige uma conta logada (o e-mail vem da conta) */
  useEffect(() => {
    let ativo = true;

    fetch(`${API}/usuarios/me`, { credentials: "include" })
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((dadosUsuario) => {
        if (ativo) setUsuario(dadosUsuario);
      })
      .catch(() => {
        if (ativo) setUsuario(null);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function montarResumo() {
    const periodos = { manha: "Manhã", tarde: "Tarde", noite: "Noite" };
    const modalidades = {
      online: "Online",
      presencial: "Presencial",
      ambos: "Online e presencial",
    };

    const partes = [];

    if (sobre) partes.push(sobre);
    if (whatsapp) partes.push("WhatsApp: " + whatsapp);
    if (uf) partes.push("Estado (UF): " + uf);
    if (periodo)
      partes.push("Período disponível: " + (periodos[periodo] || periodo));
    if (modalidade)
      partes.push("Modalidade: " + (modalidades[modalidade] || modalidade));

    return partes.join("\n\n").slice(0, 2000);
  }

  async function enviarCadastro() {
    setErro("");

    if (!usuario) {
      setErro("Faça login com a sua conta para enviar o cadastro.");
      return;
    }
    if (!crp.trim()) {
      setErro("Informe o número do CRP.");
      return;
    }
    if (!especialidade) {
      setErro("Selecione sua especialidade.");
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API}/psicologos/cadastro`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          crp: crp.trim(),
          especialidade: opcoesEspecialidade[especialidade] || especialidade,
          resumo: montarResumo(),
        }),
      });

      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          corpo.erro || "Não foi possível enviar o cadastro."
        );
      }

      setEnviado(true);
    } catch (erroEnvio) {
      setErro(erroEnvio.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Sidebar />

      <main className={styles.container}>
        <div className={styles.banner}>
        <h2>Portal do voluntário</h2>

        <p>
          Psicólogas comprometidas com a transformação social.
          Junte-se à nossa rede de profissionais voluntárias e faça
          a diferença na vida de mulheres que precisam de apoio.
        </p>
        </div>
      

      <section className={styles.beneficios}>
        <div className="container mt-5">

          <div className="row g-5">

            <div className="col-md-5">

              <h3>Por que ser voluntária?</h3>

              <div className={styles.beneficioItem}>
                <i className="bi bi-heart"></i>

                <p>
                  Impacte diretamente a vida de mulheres em situação
                  de vulnerabilidade.
                </p>
              </div>

              <div className={styles.beneficioItem}>
                <i className="bi bi-clock"></i>

                <p>
                  Concilie o trabalho voluntário com sua rotina
                  profissional.
                </p>
              </div>

              <div className={styles.beneficioItem}>
                <i className="bi bi-mortarboard"></i>

                <p>
                  Amplie sua experiência profissional por meio da
                  atuação voluntária.
                </p>
              </div>

            </div>

            <div className="col-md-7">

              <div className={styles.formulario}>
                <div className={styles.etapas}>
                  <div className={styles.etapa}>
                    <span
                      className={etapa === 1 ? styles.ativa : ""}>
                        1
                    </span>
                    <p>Dados Pessoais</p>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                  <div className={styles.etapa}>
                    <span
                      className={etapa === 2 ? styles.ativa : "" }>
                      2
                    </span>
                    <p>Credenciais</p>
                  </div>

                  <i className="bi bi-chevron-right"></i>

                  <div className={styles.etapa}>
                    <span
                      className={ etapa === 3 ? styles.ativa : ""}>
                      3
                    </span>
                    <p>Disponibilidade</p>
                  </div>

                </div>

                {etapa === 1 && (
                  <div>

                    <h3>Dados Pessoais</h3>

                    <p className={styles.subtitulo}>
                      Informações básicas para seu cadastro.
                    </p>

                    <div className={styles.campos}>

                      <div className={styles.campo}>
                        <label>Nome Completo</label>

                        <input
                          type="text"
                          placeholder="Dra. Seu Nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>E-mail Profissional</label>

                        <input
                          type="email"
                          placeholder="seu@email.com.br"
                          value={emailProfissional}
                          onChange={(e) => setEmailProfissional(e.target.value)}
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>WhatsApp</label>

                        <input
                          type="text"
                          placeholder="(11) 99999-9999"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>Estado (UF)</label>

                        <input
                          type="text"
                          placeholder="SP"
                          value={uf}
                          onChange={(e) => setUf(e.target.value)}
                        />
                      </div>

                    </div>

                    <div className={styles.sobre}>

                      <label>Sobre você</label>

                      <textarea
                        placeholder="Conte um pouco sobre sua experiência e motivação para ser voluntária..."
                        value={sobre}
                        onChange={(e) => setSobre(e.target.value)}
                      />

                    </div>

                    <button
                      className={styles.continuar}
                      onClick={() => setEtapa(2)}
                    >
                      Continuar

                      <i className="bi bi-chevron-right"></i>
                    </button>

                  </div>
                )}

                {etapa === 2 && (
                  <div>

                    <h3>Credenciais</h3>

                    <p className={styles.subtitulo}>
                      Informe seus dados profissionais
                    </p>

                    <div className={styles.campos}>

                      <div className={styles.campo}>
                        <label>Número do CRP</label>

                        <input
                          type="text"
                          placeholder="CRP 06/123456"
                          value={crp}
                          onChange={(e) => setCrp(e.target.value)}
                        />
                      </div>

                      <div className={styles.campo}>

                        <label>Especialidade</label>

                        <select
                          value={especialidade}
                          onChange={(e) => setEspecialidade(e.target.value)}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>

                          <option value="clinica">
                            Psicologia Clínica
                          </option>

                          <option value="social">
                            Psicologia Social
                          </option>

                          <option value="familiar">
                            Psicologia Familiar
                          </option>

                          <option value="outra">
                            Outra
                          </option>
                        </select>

                      </div>

                    </div>


                    <div className={styles.botoes}>

                      <button
                        className={styles.voltar}
                        onClick={() => setEtapa(1)}
                      >
                        <i className="bi bi-chevron-left"></i>
                        Voltar
                      </button>

                      <button
                        className={styles.proximo}
                        onClick={() => setEtapa(3)}
                      >
                        Continuar
                        <i className="bi bi-chevron-right"></i>
                      </button>

                    </div>

                  </div>
                )}

                {etapa === 3 && !enviado && (
                  <div>

                    <h3>Disponibilidade</h3>

                    <p className={styles.subtitulo}>
                      Informe sua disponibilidade para atendimento
                    </p>

                    <div className={styles.campos}>

                      <div className={styles.campo}>

                        <label>Período disponível</label>

                        <select
                          value={periodo}
                          onChange={(e) => setPeriodo(e.target.value)}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>

                          <option value="manha">
                            Manhã
                          </option>

                          <option value="tarde">
                            Tarde
                          </option>

                          <option value="noite">
                            Noite
                          </option>
                        </select>

                      </div>

                      <div className={styles.campo}>

                        <label>Modalidade</label>

                        <select
                          value={modalidade}
                          onChange={(e) => setModalidade(e.target.value)}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>

                          <option value="online">
                            Online
                          </option>

                          <option value="presencial">
                            Presencial
                          </option>

                          <option value="ambos">
                            Online e presencial
                          </option>
                        </select>

                      </div>

                    </div>

                    {erro && (
                      <p role="alert" style={{ color: "#c0392b" }}>
                        {erro}
                      </p>
                    )}

                    <div className={styles.botoes}>

                      <button
                        className={styles.voltar}
                        onClick={() => setEtapa(2)}
                      >
                        <i className="bi bi-chevron-left"></i>
                        Voltar
                      </button>

                      <button
                        className={styles.proximo}
                        onClick={enviarCadastro}
                        disabled={enviando}
                      >
                        {enviando ? "Enviando..." : "Enviar cadastro"}
                        <i className="bi bi-check-lg"></i>
                      </button>

                    </div>

                  </div>
                )}

                {enviado && (
                  <div>
                    <h3>Cadastro enviado!</h3>

                    <p className={styles.subtitulo}>
                      Sua solicitação para se tornar psicóloga voluntária
                      foi recebida e está <b>aguardando a análise da
                      administração</b>.
                    </p>

                    <p className={styles.subtitulo}>
                      Você receberá um e-mail com o resultado. Até lá,
                      sua conta continua com o acesso normal de usuária.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>
      </main>
    </>
  );
}

export default QueroSerVoluntario;