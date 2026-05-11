import React, { useState } from "react";
import "../styles/Cadastro.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const lidarComCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    // Validação dos campos
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      setErro("Digite um email válido.");
      return;
    }

    // Validação de senha
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await register({
        name: nome,
        email: email,
        password: senha,
      });

      localStorage.setItem("mensagem", "Cadastro realizado com sucesso!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro("Erro ao cadastrar usuário.");
      }
    }
  };

  return (
    <div className="container-principal">
      <form className="card-cadastro" onSubmit={lidarComCadastro}>
        <h1>Cadastre-se</h1>

        <div className="campo-input">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setErro("");
            }}
          />
        </div>

        <div className="campo-input">
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErro("");
            }}
          />
        </div>

        <div className="campo-input">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Crie sua senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="botao-cadastrar">
          Cadastrar
        </button>

        <p className="link-login">
          Já tem uma conta? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
