import React from 'react';
import '../styles/Input.css'; // Estilos específicos para inputs

const Input = ({ type = 'text', placeholder, value, onChange, name, className = '' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`custom-input ${className}`}
    />
  );
};

export default Input;
