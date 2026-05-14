import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // mensagem cadastro/login
  useEffect(() => {
    const mensagem = localStorage.getItem("mensagem");

    if (mensagem) {
      setErro(mensagem);
      localStorage.removeItem("mensagem");
    }
  }, []);

  const entrar = async (e) => {
    e.preventDefault();

    setErro("");

    // validação
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      setErro("Digite um email válido.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await login(email, senha);

     // console.log(response);

      // salva usuário
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(response)
      );

      // salva token
      localStorage.setItem(
        "token",
        response.token
      );

      // mensagem
      localStorage.setItem(
        "mensagem",
        "Login realizado com sucesso! 🚀"
      );

      navigate("/home");

    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro("Email ou senha inválidos.");
      }
    }
  };

  return (
    <div className="container-principal">
      <form className="card-login" onSubmit={entrar}>
        <h1>Login</h1>

        <div className="campo-input">
          <label>Email</label>

          <input
            type="email"
            placeholder="Seu email cadastrado"
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
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="botao-entrar">
          Entrar
        </button>

        <p className="link-login">
          Não tem uma conta?{" "}
          <Link to="/cadastro">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;