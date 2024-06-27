import React from 'react'
import "../styles/Header.css"
import { useNavigate } from 'react-router-dom';
import Voltar from '../img/back-arrow.png'

export const Header = ({text,showBackButton}) => {
  const navigate = useNavigate();
  return (
    <div className="Header">
       <div className='button-back'>
       {showBackButton && (
        <img  src={Voltar} className="back-arrow" onClick={() => navigate(-1)} alt='botao de voltar'>
        </img>
        )}
       </div>
      <div className="text-wrapper">{text}</div>
    </div>
  );
};
export default Header