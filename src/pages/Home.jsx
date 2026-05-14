import {
  FiLogOut,
  FiPlus,
  FiEdit,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

import "../styles/home.css";
import { useState, useEffect } from "react";

import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  concluirCard,
  cancelarCard,
  reativarCard,
} from "../services/cardService";

function Home() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};

  // Verifica se o nome existe, divide pelos espaços e pega apenas a primeira palavra
  const nome = usuarioLogado.name
    ? usuarioLogado.name.split(" ")[0]
    : "Usuário";

  const [cards, setCards] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [toast, setToast] = useState("");
  const [mostrarLogoutModal, setMostrarLogoutModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [erro, setErro] = useState("");

  const [novoCard, setNovoCard] = useState({
    nome: "",
    tema: "",
    texto: "",
    data: "",
  });

  // mensagem login/cadastro
  useEffect(() => {
    const mensagem = localStorage.getItem("mensagem");

    if (mensagem) {
      setToast(mensagem);
      localStorage.removeItem("mensagem");
    }
  }, []);

  // toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // carregar cards
  useEffect(() => {
    carregarCards();
  }, []);

  async function carregarCards() {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmarAcao() {
    const { tipo, index } = acaoModal;

    const card = cards[index];

    try {
      if (tipo === "concluir") {
        await concluirCard(card.id);
        setToast("Card concluído ✅");
      }

      if (tipo === "cancelar") {
        await cancelarCard(card.id);
        setToast("Card cancelado ❌");
      }

      if (tipo === "reativar") {
        await reativarCard(card.id);
        setToast("Card reativado 🔄");
      }

      if (tipo === "excluir") {
        await deleteCard(card.id);
        setToast("Card excluído 🗑️");
      }

      await carregarCards();
    } catch (error) {
      console.error(error);
    }

    setAcaoModal(null);
  }

  async function adicionarCard() {
    if (
      !novoCard.nome.trim() ||
      !novoCard.tema.trim() ||
      !novoCard.texto.trim() ||
      !novoCard.data.trim()
    ) {
      setErro("Preencha todos os campos!");
      return;
    }

    // formato esperado: DD/MM
    const regex = /^(\d{2})\/(\d{2})$/;

    const match = novoCard.data.match(regex);

    if (!match) {
      setErro("Formato inválido! Use: 15/05");
      return;
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);

    // valida mês
    if (mes < 1 || mes > 12) {
      setErro("Mês inválido!");
      return;
    }

    // valida dia
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (dia < 1 || dia > diasPorMes[mes - 1]) {
      setErro("Dia inválido!");
      return;
    }

    const anoAtual = new Date().getFullYear();

    // converte para LocalDate
    const endDate = `${anoAtual}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    setErro("");

    try {
      // EDITAR
      if (editandoIndex !== null) {
        const cardEditando = cards[editandoIndex];

        await updateCard(cardEditando.id, {
          name: novoCard.nome,
          theme: novoCard.tema,
          text: novoCard.texto,
          endDate: endDate,
          status: cardEditando.status,
        });

        setToast("Card atualizado com sucesso ✅");
      }

      // CRIAR
      else {
        await createCard({
          name: novoCard.nome,
          theme: novoCard.tema,
          text: novoCard.texto,
          endDate: endDate,
          status: "PENDENTE",
        });

        setToast("Card criado com sucesso 🚀");
      }

      await carregarCards();

      setEditandoIndex(null);

      setNovoCard({
        nome: "",
        tema: "",
        texto: "",
        data: "",
      });

      setMostrarModal(false);
    } catch (error) {
      console.error(error);

      console.log(error.response);

      setErro("Erro ao salvar card.");
    }
  }

  return (
    <div className="container">
      {toast && <div className="toast">{toast}</div>}

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <h2>Study card</h2>

          {mostrarLogoutModal && (
            <div className="modal-overlay">
              <div className="modal logout-modal">
                <h2>Deseja sair?</h2>

                <div className="logout-buttons">
                  <button
                    className="cancelar"
                    onClick={() => setMostrarLogoutModal(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="sair"
                    onClick={() => {
                      localStorage.removeItem("usuarioLogado");
                      localStorage.removeItem("token");

                      setMostrarLogoutModal(false);

                      localStorage.setItem(
                        "mensagem",
                        "Você saiu com sucesso 👋",
                      );

                      window.location.href = "/login";
                    }}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            className="logout"
            onClick={() => setMostrarLogoutModal(true)}
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </header>

      {/* MODAL AÇÕES */}
      {acaoModal && (
        <div className="modal-overlay">
          <div className="modal logout-modal">
            <h2>
              {acaoModal.tipo === "excluir" && "Deseja excluir o card?"}
              {acaoModal.tipo === "concluir" && "Marcar como concluído?"}
              {acaoModal.tipo === "cancelar" && "Deseja cancelar o card?"}
              {acaoModal.tipo === "reativar" && "Deseja reativar o card?"}
            </h2>

            <div className="logout-buttons">
              <button className="cancelar" onClick={() => setAcaoModal(null)}>
                voltar
              </button>

              <button
                className="sair"
                onClick={async () => {
                  await confirmarAcao();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARD */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="fechar" onClick={() => setMostrarModal(false)}>
              X
            </button>

            <h2>{editandoIndex !== null ? "Editar Card" : "Novo Card"}</h2>

            <label>Nome</label>

            <input
              type="text"
              placeholder="Ex: Nome do card..."
              value={novoCard.nome}
              onChange={(e) => {
                setNovoCard({
                  ...novoCard,
                  nome: e.target.value,
                });
                setErro("");
              }}
            />

            <label>Tema</label>

            <input
              type="text"
              placeholder="Ex: Matemática aplicada, Back-end..."
              value={novoCard.tema}
              onChange={(e) => {
                setNovoCard({
                  ...novoCard,
                  tema: e.target.value,
                });
                setErro("");
              }}
            />

            <label>Texto</label>

            <input
              type="text"
              placeholder="Ex: Revisar React, estudar para prova..."
              value={novoCard.texto}
              onChange={(e) => {
                setNovoCard({
                  ...novoCard,
                  texto: e.target.value,
                });
                setErro("");
              }}
            />

            <label>Data</label>

            <input
              type="text"
              placeholder="ex: 15/05"
              value={novoCard.data}
              onChange={(e) => {
                setNovoCard({
                  ...novoCard,
                  data: e.target.value,
                });

                setErro("");
              }}
            />

            {erro && <p className="erro">{erro}</p>}

            <button className="btn-criar" onClick={adicionarCard}>
              {editandoIndex !== null ? "Salvar" : "Criar"}
            </button>
          </div>
        </div>
      )}

      {/* BOAS VINDAS */}
      <div className="welcome">
        <div className="welcome-box">
          <h1>Bem-Vindo,</h1>
        </div>

        <div className="name-box">
          <h2>{nome}</h2>
        </div>

        <button
          className="btn-novo"
          onClick={() => {
            setMostrarModal(true);
            setErro("");
            setEditandoIndex(null);

            setNovoCard({
              nome: "",
              tema: "",
              texto: "",
              data: "",
            });
          }}
        >
          novo <FiPlus size={44} />
        </button>
      </div>

      {/* TÍTULO */}
      <h3 className="titulo">minhas tarefas</h3>

      {/* CARDS */}
      <div className="cards">
        {cards.map((card, index) => (
          <div className={`card ${card.status?.toLowerCase()}`} key={card.id}>
            <div className="card-top">
              <strong>{card.name}</strong>
              <span>{card.theme}</span>
            </div>

            <p>{card.text}</p>

            <div className="card-info">
              <div className="info-left">
                <span className="info-item">
                  <FiClock size={16} />
                  {card.endDate}
                </span>

                <span className="info-item">
                  {card.status?.toLowerCase() === "pendente" && (
                    <>
                      <FiAlertCircle size={16} /> Pendente
                    </>
                  )}

                  {card.status?.toLowerCase() === "concluido" && (
                    <>
                      <FiCheckCircle size={16} /> Concluído
                    </>
                  )}

                  {card.status?.toLowerCase() === "cancelado" && (
                    <>
                      <FiXCircle size={16} /> Cancelado
                    </>
                  )}
                </span>
              </div>

              <button
                className="edit-btn"
                onClick={() => {
                  setMostrarModal(true);

                  setNovoCard({
                    nome: card.name,
                    tema: card.theme,
                    texto: card.text,
                    data: card.endDate,
                  });

                  setEditandoIndex(index);
                  setErro("");
                }}
              >
                <FiEdit size={20} />
              </button>
            </div>

            <div className="card-buttons">
              {card.status?.toLowerCase() === "pendente" && (
                <>
                  <button
                    className="concluir"
                    onClick={() =>
                      setAcaoModal({
                        tipo: "concluir",
                        index,
                      })
                    }
                  >
                    Concluir
                  </button>

                  <button
                    className="cancelar"
                    onClick={() =>
                      setAcaoModal({
                        tipo: "cancelar",
                        index,
                      })
                    }
                  >
                    Cancelar
                  </button>
                </>
              )}

              {card.status?.toLowerCase() === "concluido" && (
                <button
                  className="excluir"
                  onClick={() =>
                    setAcaoModal({
                      tipo: "excluir",
                      index,
                    })
                  }
                >
                  Excluir
                </button>
              )}

              {card.status?.toLowerCase() === "cancelado" && (
                <>
                  <button
                    className="reativar"
                    onClick={() =>
                      setAcaoModal({
                        tipo: "reativar",
                        index,
                      })
                    }
                  >
                    Reativar
                  </button>

                  <button
                    className="excluir"
                    onClick={() =>
                      setAcaoModal({
                        tipo: "excluir",
                        index,
                      })
                    }
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
