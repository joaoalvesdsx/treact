import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../commons/Header';
import "../styles/Menu.css";
import { useAuth } from '../../context/AuthContext';

function Menu() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { logout } = useAuth();
  useEffect(() => {
    if (!auth.token) {
      navigate('/');
    }
  }, [auth.token, navigate]);

  const handleLogout = () => {
    // Limpar o token de autenticação ou chamar uma função de logout no contexto
    logout();
    navigate('/');
  };

  return (
    <>
      <Header text="Menu" showBackButton={false} />
      <div className='display-container'>
        <ul className='ul-menu'>
          <li onClick={() => navigate('/listar-empresas')}>Listar Empresas</li>
          <li onClick={() => navigate('/buscar-empresa')}>Buscar por Empresa</li>
          <li onClick={() => navigate('/cadastrar-empresa')}>Cadastrar Empresa</li>
          <li onClick={() => navigate('/registrar-proposta')}>Propostas</li>
          <li onClick={() => navigate('/servicos')}>Serviços</li>
          <li onClick={handleLogout}>Sair</li>
        </ul>
      </div>
    </>
  );
}

export default Menu;
