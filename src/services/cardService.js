import axios from "axios";

const API_URL = "https://studycard.azurewebsites.net/cards";

function authHeader() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// LISTAR
export async function getCards() {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
}

// CRIAR
export async function createCard(card) {
  const response = await axios.post(
    API_URL,
    card,
    authHeader(),
  );

  return response.data;
}

// ATUALIZAR
export async function updateCard(id, card) {
  const response = await axios.put(
    `${API_URL}/${id}`,
    card,
    authHeader(),
  );

  return response.data;
}

// EXCLUIR
export async function deleteCard(id) {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    authHeader(),
  );

  return response.data;
}

// CONCLUIR
export async function concluirCard(id) {
  const response = await axios.patch(
    `${API_URL}/${id}/concluir`,
    {},
    authHeader(),
  );

  return response.data;
}

// CANCELAR
export async function cancelarCard(id) {
  const response = await axios.patch(
    `${API_URL}/${id}/cancelar`,
    {},
    authHeader(),
  );

  return response.data;
}

// REATIVAR
export async function reativarCard(id) {
  const response = await axios.patch(
    `${API_URL}/${id}/reativar`,
    {},
    authHeader(),
  );

  return response.data;
}