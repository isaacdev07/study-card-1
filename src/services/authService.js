import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const login = async (email, senha) => {
  const response = await api.post("/auth/login", {
    email: email,
    password: senha,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioLogado");
};