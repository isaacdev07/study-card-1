import React, { useState } from 'react';
import '../styles/Cadastro.css';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  
  const lidarComCadastro = (e) => {
    e.preventDefault();
    setErro('');

    // Validação dos campos
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setErro('Digite um email válido.');
      return;
    }

    // Validação de senha
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Busca usuários já cadastrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o email já existe
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.email === email
    );

    if (usuarioExistente) {
      setErro('Este email já está cadastrado.');
      return;
    }

    // Cria novo usuário
    const novoUsuario = {
      nome,
      email,
      senha,
    };

    // Salva no localStorage
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    localStorage.setItem('mensagem', 'Cadastro realizado com sucesso!');
navigate('/login');

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
              setErro('');
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
              setErro('');
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
              setErro('');
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