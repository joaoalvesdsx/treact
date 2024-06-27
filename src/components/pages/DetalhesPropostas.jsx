import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import '../styles/DetalhesProposta.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
const DetalhesProposta = () => {
  const { id } = useParams();
  const [proposta, setProposta] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [newFollowUp, setNewFollowUp] = useState({ data: '', tratativa: '' });
  const { auth } = useAuth();

  useEffect(() => {
    const fetchProposta = async () => {
      try {
        const response = await api.get(`/buscar_proposta_por_id?id=${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setProposta(response.data);
      } catch (error) {
        console.error('Erro ao buscar proposta:', error);
      }
    };

    const fetchFollowUps = async () => {
      try {
        const response = await api.get(`/listar_followups_por_proposta?id=${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setFollowUps(response.data);
      } catch (error) {
        console.error('Erro ao buscar follow-ups:', error);
      }
    };

    fetchProposta();
    fetchFollowUps();
  }, [id, auth.token]);

  const handleCreateFollowUp = async () => {
    try {
      await api.post('/criar_followup', {
        ...newFollowUp,
        propostaId: id
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setFollowUps([...followUps, newFollowUp]);
      setNewFollowUp({ data: '', tratativa: '' });
    } catch (error) {
      console.error('Erro ao criar follow-up:', error);
    }
  };

  if (!proposta) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header text="Follow Up" showBackButton={true} />
      <div className="detalhes-proposta">
        <h2>Follow Up</h2>
        <div className="proposta-info">
          <div className="info-group">
            <label>Número:</label>
            <span>{proposta.numero}</span>
          </div>
          <div className="info-group">
            <label>Cliente/Empresa:</label>
            <span>{proposta.nome_empresa}</span>
          </div>
          <div className="info-group">
            <label>Data da Proposta:</label>
            <span>{proposta.data}</span>
          </div>
          <div className="info-group">
            <label>Descrição/Produto e Serviço:</label>
            <span>{proposta.descricao}</span>
          </div>
          <div className="info-group">
            <label>Status:</label>
            <span>{proposta.status}</span>
          </div>
        </div>
        <h3>Follow Ups</h3>
        {followUps.map((followUp, index) => (
          <div key={index} className="follow-up">
            <div className="info-group">
              <label>Data:</label>
              <span>{followUp.data}</span>
            </div>
            <div className="info-group">
              <label>Tratativa:</label>
              <span>{followUp.tratativa}</span>
            </div>
          </div>
        ))}
        <div className="create-follow-up">
          <h4>Criar Follow Up</h4>
          <Input 
            classname="input-forms"
            type="date"
            placeholder="Data"
            value={newFollowUp.data}
            onChange={(e) => setNewFollowUp({ ...newFollowUp, data: e.target.value })}
          />
          <Input 
            classname="input-forms"
            type="text"
            placeholder="Tratativa"
            value={newFollowUp.tratativa}
            onChange={(e) => setNewFollowUp({ ...newFollowUp, tratativa: e.target.value })}
          />
          <Button className='button-form' onClick={handleCreateFollowUp}>Criar Follow Up</Button>
        </div>
      </div>
    </>
  );
};

export default DetalhesProposta;
