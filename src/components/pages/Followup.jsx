import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import '../styles/Followup.css';
import { useAuth } from '../../context/AuthContext';

const FollowUp = () => {
  const { auth } = useAuth();
  const { _id } = useParams(); 
  const [proposta, setProposta] = useState({});
  const [imagens, setImagens] = useState([]);
  const [newImagem, setNewImagem] = useState({ descricao: '', file: null });
  const [revisoes, setRevisoes] = useState([]);
  const [newRevisao, setNewRevisao] = useState({ data: '', revisao: '', descricao: '' });
  const [tratativas, setTratativas] = useState([]);
  const [newTratativa, setNewTratativa] = useState({ data: '', descricao: '' });

  useEffect(() => {
    const fetchPropostaData = async () => {
      try {
        console.log('Buscando dados da proposta...');
        const response = await api.get(`/proposta/${_id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        console.log('Dados da proposta recebidos:', response.data);
        setProposta(response.data);
        setImagens(response.data.imagens);
        setRevisoes(response.data.revisoes);
        setTratativas(response.data.tratativas);
      } catch (error) {
        console.error('Erro ao buscar dados da proposta:', error);
      }
    };

    fetchPropostaData();
  }, [_id, auth.token]);

  const handleAddImagem = async () => {
    const formData = new FormData();
    formData.append('file', newImagem.file);
    formData.append('descricao', newImagem.descricao);

    try {
      console.log('Enviando imagem...');
      await api.post(`/upload_imagem/${_id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setImagens([...imagens, { descricao: newImagem.descricao, path: newImagem.file.name }]);
      setNewImagem({ descricao: '', file: null });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      console.log('Enviando requisição para atualizar status:', newStatus);
      console.log(_id)
      console.log(newStatus)
      const response = await api.post('/atualizar_proposta', { _id :_id, status: newStatus }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      console.log('Resposta da atualização de status:', response);
      if (response.status === 200) {
        setProposta(prev => ({ ...prev, status: newStatus }));
      } else {
        console.error('Erro ao atualizar status:', response);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleImagemChange = (e) => {
    setNewImagem({ ...newImagem, file: e.target.files[0] });
  };

  const handleDescricaoChange = (e) => {
    setNewImagem({ ...newImagem, descricao: e.target.value });
  };

  const handleSaveRevisao = async () => {
    const revisao = { ...newRevisao, data: new Date().toLocaleDateString('pt-BR') };
    try {
      console.log('Salvando revisão...');
      await api.post(`/adicionar_revisao/${_id}`, revisao, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setRevisoes([...revisoes, revisao]);
      setNewRevisao({ data: '', revisao: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao salvar a revisão:', error);
    }
  };

  const handleSaveTratativa = async () => {
    const tratativa = { ...newTratativa, data: new Date().toLocaleDateString('pt-BR') };
    try {
      console.log('Salvando tratativa...');
      await api.post(`/adicionar_tratativa/${_id}`, tratativa, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setTratativas([...tratativas, tratativa]);
      setNewTratativa({ data: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao salvar a tratativa:', error);
    }
  };

  return (
    <div className="follow-up">
      <Header text="Follow Up" showBackButton={true} />
      
      <div className="proposta-info">
        <div className='box1'>
          <p><strong>ID:</strong> {proposta._id}</p>
          <p><strong>Cliente/Empresa:</strong> {proposta.cnpj_empresa}</p>
          <p><strong>Data da Proposta:</strong> {proposta.data}</p>
        </div>
        <div className='box2'>
          <p><strong>Descricao:</strong> {proposta.descricao}</p>
          <p><strong>Referência:</strong> {proposta.referencia}</p>
          <p><strong>Status:</strong>
            <select className="select" value={proposta.status} onChange={(e) => handleUpdateStatus(e.target.value)}>
              <option value="Aberta">Aberta</option>
              <option value="Fechada">Fechada</option>
              <option value="Rejeitada">Rejeitada</option>
            </select>
          </p>
        </div>
      </div>

      <h2>Imagens</h2>
      <div className="imagem-section">
        <div className='image-box'>
          {imagens.map(imagem => (
            <div key={imagem.path} className="imagem">            
              <img src={`/get_imagem/${imagem.path}`} alt={imagem.descricao} width="250" height="250" />
              <p>{imagem.descricao}</p>
            </div>
          ))}
        </div>
        <div className='input-image'>
          <Input 
            className="input-add" 
            type="text" 
            placeholder="Descrição da Imagem" 
            value={newImagem.descricao} 
            onChange={handleDescricaoChange} 
          />
          <Input 
            className="input-add" 
            type="file" 
            onChange={handleImagemChange} 
          />
          <Button className='button-add' onClick={handleAddImagem}>+</Button>
        </div>
      </div>
      <h2>Revisões</h2>
      <div className="revisao-section">
        <div className='revisao'>
          {revisoes.map(revisao => (
            <div key={revisao.id} className="revisao">
              <p>{revisao.data} - Revisão {revisao.revisao}: {revisao.descricao}</p>
            </div>
          ))}
        </div>
        <div className='input-image'>
          <Input 
            className="input-add" 
            type="text" 
            placeholder="Revisão (e.g. 1, 2, 3...)" 
            value={newRevisao.revisao} 
            onChange={(e) => setNewRevisao({ ...newRevisao, revisao: e.target.value })} 
          />
          <Input 
            className="input-add" 
            type="text" 
            placeholder="Descrição" 
            value={newRevisao.descricao} 
            onChange={(e) => setNewRevisao({ ...newRevisao, descricao: e.target.value })} 
          />
          <Button className='button-add' onClick={handleSaveRevisao}>+</Button>
        </div>
      </div>
      <h2>Tratativas</h2>
      <div className="tratativa-section">
        <div className='tratativa'>
          {tratativas.map(tratativa => (
            <div key={tratativa.id} className="tratativa">
              <p>{tratativa.data} - {tratativa.descricao}</p>
            </div>
          ))}
        </div>
        <div className='input-image'>
          <Input 
            className="input-add-tratativa" 
            type="text" 
            placeholder="Descrição da Tratativa" 
            value={newTratativa.descricao} 
            onChange={(e) => setNewTratativa({ ...newTratativa, descricao: e.target.value })} 
          />
          <Button className='button-add' onClick={handleSaveTratativa}>+</Button>
        </div>
      </div>
    </div>
  );
};

export default FollowUp;
