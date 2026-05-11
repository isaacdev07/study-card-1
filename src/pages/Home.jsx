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

function Home() {

// Nome do usuário logado
const usuarioLogado =
  JSON.parse(localStorage.getItem("usuarioLogado")) || {};
  // Exibe mensagem vinda do Login/Cadastro
useEffect(() => {
  const mensagem = localStorage.getItem("mensagem");

  if (mensagem) {
    setToast(mensagem);
    localStorage.removeItem("mensagem");
  }
}, []);

// Se existir nome, exibe o nome cadastrado.
// Caso contrário, mostra "Usuário".
const nome = usuarioLogado.nome || "Usuário";
  // 🔥 CARREGAR LOCALSTORAGE
  const [cards, setCards] = useState(() => {
    const dadosSalvos = localStorage.getItem("cards");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [toast, setToast] = useState("");
  const [mostrarLogoutModal, setMostrarLogoutModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState(null);
  // { tipo: "excluir" | "concluir" | "cancelar" | "reativar", index: number }
  const [mostrarModal, setMostrarModal] = useState(false);
  const [erro, setErro] = useState("");

  const [novoCard, setNovoCard] = useState({
    nome: "",
    tema: "",
    texto: "",
    data: "",
  });

  // 🔥 SALVAR AUTOMÁTICO
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  function confirmarAcao() {
    const { tipo, index } = acaoModal;

    const novos = [...cards];

    if (tipo === "concluir") {
      novos[index].status = "concluido";
      setCards(novos);
    }

    if (tipo === "cancelar") {
      novos[index].status = "cancelado";
      setCards(novos);
    }

    if (tipo === "reativar") {
      novos[index].status = "pendente";
      setCards(novos);
    }

    if (tipo === "excluir") {
      const filtrados = cards.filter((_, i) => i !== index);
      setCards(filtrados);
    }

    setAcaoModal(null);
  }
  // ✅ CONCLUIR
  function concluirCard(index) {
    const novos = [...cards];
    novos[index].status = "concluido";
    setCards(novos);
  }

  // ❌ CANCELAR
  function cancelarCard(index) {
    const novos = [...cards];
    novos[index].status = "cancelado";
    setCards(novos);
  }

  // 🔄 REATIVAR
  function reativarCard(index) {
    const novos = [...cards];
    novos[index].status = "pendente";
    setCards(novos);
  }

  // 🗑 EXCLUIR
  function excluirCard(index) {
    const novos = cards.filter((_, i) => i !== index);
    setCards(novos);
  }

  // ➕ ADICIONAR CARD
  // ➕ ADICIONAR CARD
function adicionarCard() {
  if (
    !novoCard.nome.trim() ||
    !novoCard.tema.trim() ||
    !novoCard.texto.trim() ||
    !novoCard.data.trim()
  ) {
    setErro("Preencha todos os campos!");
    return;
  }

  // Valida formato: DD/MM - DD/MM
  const regex = /^(\d{2})\/(\d{2})\s-\s(\d{2})\/(\d{2})$/;
  const match = novoCard.data.match(regex);

  if (!match) {
    setErro("Formato de data inválido! Use: 10/03 - 15/03");
    return;
  }

  // Captura as datas
  const diaInicio = parseInt(match[1], 10);
  const mesInicio = parseInt(match[2], 10);
  const diaFim = parseInt(match[3], 10);
  const mesFim = parseInt(match[4], 10);

  // Função para validar se a data existe
  function dataValida(dia, mes) {
    if (mes < 1 || mes > 12) return false;

    const diasPorMes = [
      31, // Jan
      28, // Fev
      31, // Mar
      30, // Abr
      31, // Mai
      30, // Jun
      31, // Jul
      31, // Ago
      30, // Set
      31, // Out
      30, // Nov
      31, // Dez
    ];

    return dia >= 1 && dia <= diasPorMes[mes - 1];
  }

  // Valida data inicial
  if (!dataValida(diaInicio, mesInicio)) {
    setErro("Data inicial inválida!");
    return;
  }

  // Valida data final
  if (!dataValida(diaFim, mesFim)) {
    setErro("Data final inválida!");
    return;
  }

  // Cria objetos Date para comparar
  const anoAtual = new Date().getFullYear();

  const dataInicio = new Date(anoAtual, mesInicio - 1, diaInicio);
  const dataFim = new Date(anoAtual, mesFim - 1, diaFim);

  // Verifica se a data final é menor que a inicial
  if (dataFim < dataInicio) {
    setErro("A data final não pode ser menor que a data inicial!");
    return;
  }

  setErro("");

  // 🔥 SE ESTIVER EDITANDO
  if (editandoIndex !== null) {
    const novos = [...cards];

    // Mantém o status do card
    novos[editandoIndex] = {
      ...novoCard,
      status: cards[editandoIndex].status,
    };

    setCards(novos);
    setEditandoIndex(null);
    setToast("Card atualizado com sucesso ✅");
  } else {
    setCards([
      ...cards,
      {
        ...novoCard,
        status: "pendente",
      },
    ]);
    setToast("Card criado com sucesso 🚀");
  }

  // Limpa formulário
  setNovoCard({
    nome: "",
    tema: "",
    texto: "",
    data: "",
  });

  setMostrarModal(false);
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
          // Substitua apenas o onClick do botão "Sair" por este código
onClick={() => {
  // Remove o usuário logado do localStorage
  localStorage.removeItem("usuarioLogado");

  // Fecha o modal
  setMostrarLogoutModal(false);

  // Salva mensagem para aparecer na tela de login
  localStorage.setItem("mensagem", "Você saiu com sucesso 👋");

  // Redireciona para o login
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
  onClick={() => {
    confirmarAcao();

    if (acaoModal.tipo === "excluir") {
      setToast("Card excluído 🗑️");
    }
    if (acaoModal.tipo === "concluir") {
      setToast("Card concluído ✅");
    }
    if (acaoModal.tipo === "cancelar") {
      setToast("Card cancelado ❌");
    }
    if (acaoModal.tipo === "reativar") {
      setToast("Card reativado 🔄");
    }
  }}
>
  Confirmar
</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
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
                setNovoCard({ ...novoCard, nome: e.target.value });
                setErro("");
              }}
            />

            <label>Tema</label>
            <input
              type="text"
              placeholder="Ex: Matemática aplicada, Back-end..."
              value={novoCard.tema}
              onChange={(e) => {
                setNovoCard({ ...novoCard, tema: e.target.value });
                setErro("");
              }}
            />

            <label>Texto</label>
            <input
              type="text"
              placeholder="Ex: Revisar React, estudar para prova..."
              value={novoCard.texto}
              onChange={(e) => {
                setNovoCard({ ...novoCard, texto: e.target.value });
                setErro("");
              }}
            />

            <label>Data</label>
            <input
              type="text"
              placeholder="10/03 - 15/03"
              value={novoCard.data}
              onChange={(e) => {
                setNovoCard({ ...novoCard, data: e.target.value });
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
            setEditandoIndex(null); // 🔥 limpa edição
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
          <div className={`card ${card.status}`} key={index}>
            <div className="card-top">
              <strong>{card.nome}</strong>
              <span>{card.tema}</span>
            </div>

            <p>{card.texto}</p>

            <div className="card-info">
              <div className="info-left">
                <span className="info-item">
                  <FiClock size={16} />
                  {card.data}
                </span>

                <span className="info-item">
                  {card.status === "pendente" && (
                    <>
                      <FiAlertCircle size={16} /> Pendente
                    </>
                  )}

                  {card.status === "concluido" && (
                    <>
                      <FiCheckCircle size={16} /> Concluído
                    </>
                  )}

                  {card.status === "cancelado" && (
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
                  setNovoCard({ ...card });
                  setEditandoIndex(index);
                  setErro("");
                }}
              >
                <FiEdit size={20} />
              </button>
            </div>

            <div className="card-buttons">
              {card.status === "pendente" && (
                <>
                  <button
                    className="concluir"
                    onClick={() => setAcaoModal({ tipo: "concluir", index })}
                  >
                    Concluir
                  </button>

                  <button
                    className="cancelar"
                    onClick={() => setAcaoModal({ tipo: "cancelar", index })}
                  >
                    Cancelar
                  </button>
                </>
              )}

              {card.status === "concluido" && (
                <button
                  className="excluir"
                  onClick={() => setAcaoModal({ tipo: "excluir", index })}
                >
                  Excluir
                </button>
              )}
              {card.status === "cancelado" && (
                <>
                  <button
                    className="reativar"
                    onClick={() => setAcaoModal({ tipo: "reativar", index })}
                  >
                    Reativar
                  </button>

                  <button
                    className="excluir"
                    onClick={() => setAcaoModal({ tipo: "excluir", index })}
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
