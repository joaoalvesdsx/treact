import React from 'react';
import '../styles/Button.css'; // Estilos específicos para botões

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button type={type} className={`custom-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
