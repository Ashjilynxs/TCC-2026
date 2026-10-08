import { useState } from "react";
import styles from "./QueroSerVoluntario.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";

function QueroSerVoluntario() {
  const [etapa, setEtapa] = useState(1);

  return (
    <>
      <Sidebar />

      <main className={styles.banner}>
        <h2>Portal do voluntário</h2>

        <p>
          Psicólogas comprometidas com a transformação social.
          Junte-se à nossa rede de profissionais voluntárias e faça
          a diferença na vida de mulheres que precisam de apoio.
        </p>
      </main>

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
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>E-mail Profissional</label>

                        <input
                          type="email"
                          placeholder="seu@email.com.br"
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>WhatsApp</label>

                        <input
                          type="text"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div className={styles.campo}>
                        <label>Estado (UF)</label>

                        <input
                          type="text"
                          placeholder="SP"
                        />
                      </div>

                    </div>

                    <div className={styles.sobre}>

                      <label>Sobre você</label>

                      <textarea
                        placeholder="Conte um pouco sobre sua experiência e motivação para ser voluntária..."
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
                        />
                      </div>

                      <div className={styles.campo}>

                        <label>Especialidade</label>

                        <select defaultValue="">
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

                {etapa === 3 && (
                  <div>

                    <h3>Disponibilidade</h3>

                    <p className={styles.subtitulo}>
                      Informe sua disponibilidade para atendimento
                    </p>

                    <div className={styles.campos}>

                      <div className={styles.campo}>

                        <label>Período disponível</label>

                        <select defaultValue="">
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

                        <select defaultValue="">
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
                      >
                        Enviar cadastro
                        <i className="bi bi-check-lg"></i>
                      </button>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default QueroSerVoluntario;