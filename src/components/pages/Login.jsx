import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../commons/Button';
import Input from '../commons/Input';
import '../styles/login.css';
import Header from '../commons/Header';
import ImageL from '../img/logo.jpeg';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(usuario, senha);
      setErrorMessage(''); // Limpa a mensagem de erro se o login for bem-sucedido
    } catch (error) {
      setErrorMessage(error.message); // Define a mensagem de erro se ocorrer uma exceção
    }
  };

  return (
    <>
      <Header text="Login"/>
      <div className="login">
        <div className="div">
          <div className="flexcontainer">
            <p className="text-1">
              <span className="span">Bem vindo,<br /></span>
            </p>
            <p className="text">
              <span className="span">insira suas credenciais.</span>
            </p>
          </div>
          <div className='painel'>
            <div className='userbox'>
              <div className="text-wrapper-3">Usuário :</div>
              <Input
                type="text"
                className="input"
                placeholder=""
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
            <div className='userbox-1'>
              <div className="text-wrapper-3">Senha :</div>
              <Input
                type="password"
                className="input"
                placeholder=""
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>  
            {errorMessage && <div className="error-message">Usuário ou senha incorretos.</div>} {/* Exibe a mensagem de erro se houver */}
          </div>
          <Button className="overlap" onClick={handleLogin}>
            <div className="text-wrapper-2">Entrar</div>
          </Button>
        </div>
        <img src={ImageL} alt="Login" className="login-image" />
      </div>
    </>
  );
}

export default Login;
