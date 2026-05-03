import React, { useState } from 'react';
import '../styles/Cadastro.css';
import { Link } from 'react-router-dom';



function Cadastro() {
  // Criando o "estado" para cada campo do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função que será executada ao clicar no botão
  const lidarComCadastro = (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Aqui você faria o envio para um banco de dados
    console.log("Dados capturados com JS:");
    console.log({ nome, email, senha });
    
    alert(`Usuário ${nome} cadastrado com sucesso!`);
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
            onChange={(e) => setNome(e.target.value)} 
          />
        </div>

        <div className="campo-input">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Digite seu Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="campo-input">
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Crie sua senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

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