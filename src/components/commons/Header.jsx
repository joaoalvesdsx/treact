import React from 'react';
import "../styles/Header.css";
import { useNavigate } from 'react-router-dom';
import Voltar from '../img/back-arrow.png';
import MenuIcon from '../img/menu-principal.png'; // Novo ícone de menu

export const Header = ({ text, showBackButton }) => {
  const navigate = useNavigate();
  return (
    <div className="Header">
      <div className='button-back'>
        {showBackButton && (
          <img 
            src={Voltar} 
            className="back-arrow" 
            onClick={() => navigate(-1)} 
            alt='botao de voltar'
          />
        )}
      </div>
      <div className="text-wrapper">{text}</div>
      <div className='button-menu'>
        {showBackButton && (
          <img 
            src={MenuIcon} 
            className="menu-icon" 
            onClick={() => navigate('/menu')} 
            alt='botao de menu'
          />
        )}
      </div>
    </div>
  );
};

export default Header;
