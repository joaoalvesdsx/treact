import React, { useState } from 'react';
import '../styles/ContactCard.css';

const ContactCard = ({  name, funcao, phone, email, cellphone, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="contact-card" onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
      {showDelete && (
        <div className="delete-button" onClick={() => onDelete(name,cellphone)}>
          X
        </div>
      )}
      <div>
        <p><strong>{name}</strong></p>
        <p>{funcao}</p>
        <p>{phone}</p>
        <p>{email}</p>
        <p>{cellphone}</p>
      </div>
    </div>
  );
};

export default ContactCard;
