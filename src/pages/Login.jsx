import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Exibe mensagem vinda do Cadastro
  useEffect(() => {
    const mensagem = localStorage.getItem('mensagem');

    if (mensagem) {
      setErro(mensagem); // Mostra a mensagem na tela
      localStorage.removeItem('mensagem');
    }
  }, []);

  const entrar = (e) => {
    e.preventDefault();
    setErro('');

    // Validação dos campos
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setErro('Digite um email válido.');
      return;
    }

    // Validação da senha
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Busca usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Procura usuário com email e senha
    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.email === email &&
        usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      setErro('Email ou senha inválidos.');
      return;
    }

    // Salva usuário logado
    localStorage.setItem(
      'usuarioLogado',
      JSON.stringify(usuarioEncontrado)
    );

    // Salva mensagem para a Home
    localStorage.setItem('mensagem','Login realizado com sucesso!');

    // Redireciona automaticamente
    navigate('/home');
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
              setErro('');
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
              setErro('');
            }}
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="botao-entrar">
          Entrar
        </button>

        <p className="link-login">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;