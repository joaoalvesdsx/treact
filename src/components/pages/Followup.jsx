import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import api from '../../api';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import '../styles/Followup.css';
import { useAuth } from '../../context/AuthContext';

Modal.setAppElement('#root'); // Para acessibilidade

const FollowUp = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { _id } = useParams(); 
  const [proposta, setProposta] = useState({});
  const [empresaNome, setEmpresaNome] = useState('');
  const [imagens, setImagens] = useState([]);
  const [newImagem, setNewImagem] = useState({ descricao: '', file: null });
  const [revisoes, setRevisoes] = useState([]);
  const [newRevisao, setNewRevisao] = useState({ data: '', revisao: '', descricao: '' });
  const [tratativas, setTratativas] = useState([]);
  const [newTratativa, setNewTratativa] = useState({ data: '', descricao: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Novo estado para edição
  const [observacao, setObservacao] = useState(''); // Estado para observação

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
        setObservacao(response.data.observacao); // Definindo a observação

        // Buscar o nome da empresa
        const empresaResponse = await api.get(`/listar_empresa_por_cnpj?cnpj=${response.data.cnpj_empresa}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setEmpresaNome(empresaResponse.data.nome_empresa);

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
        const response = await api.post(`/upload_imagem/${_id}`, formData, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Resposta do upload da imagem:', response);
        setImagens([...imagens, { descricao: newImagem.descricao, path: newImagem.file.name }]);
        setNewImagem({ descricao: '', file: null });
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      console.log('Enviando requisição para atualizar status:', newStatus);
      const response = await api.post('/atualizar_proposta', { _id: _id, status: newStatus }, {
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

  const handleDeleteProposta = async () => {
    try {
      console.log('Apagando proposta...');
      const response = await api.delete(`/deletar_proposta/${_id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log('Resposta ao apagar proposta:', response);
      if (response.status === 200) {
        navigate('/menu'); // Redirecionar após deletar a proposta
      } else {
        console.log(_id)
        console.error('Erro ao apagar proposta:', response);
      }
    } catch (error) {
      console.log(_id)
      console.error('Erro ao apagar proposta:', error);
    }
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log('Salvando edições...');
      const response = await api.post('/atualizar_proposta', {
        _id: _id,
        numero: proposta.numero,
        cliente: empresaNome,
        data: proposta.data,
        status: proposta.status,
        descricao: proposta.descricao,
        referencia: proposta.referencia,
        observacao: observacao
      }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      console.log('Resposta ao salvar edições:', response);
      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.error('Erro ao salvar edições:', response);
      }
    } catch (error) {
      console.error('Erro ao salvar edições:', error);
    }
  };

  return (
    <div className="follow-up">
      <Header text="Follow Up" showBackButton={true} />
      
      <div className="proposta-info" onClick={handleEditClick}>
        <div className='box1'>
          <p><strong>Numero da proposta:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={proposta.numero} 
              onChange={(e) => setProposta({ ...proposta, numero: e.target.value })} 
            />
          ) : (
            <p>{proposta.numero}</p>
          )}
          <p><strong>Cliente/Empresa:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={empresaNome} 
              onChange={(e) => setEmpresaNome(e.target.value)} 
            />
          ) : (
            <p>{empresaNome}</p>
          )}
          <p><strong>Data da Proposta:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={proposta.data} 
              onChange={(e) => setProposta({ ...proposta, data: e.target.value })} 
            />
          ) : (
            <p>{proposta.data}</p>
          )}
        </div>
        <div className='box2'>
          <p><strong>Status:</strong></p>
          {isEditing ? (
            <select className="select" value={proposta.status} onChange={(e) => setProposta({ ...proposta, status: e.target.value })}>
              <option value="Aberta">Aberta</option>
              <option value="Fechada">Fechada</option>
              <option value="Pendente">Pendente</option>
            </select>
          ) : (
            <p>{proposta.status}</p>
          )}
          <p><strong>Descricao:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={proposta.descricao} 
              onChange={(e) => setProposta({ ...proposta, descricao: e.target.value })} 
            />
          ) : (
            <p>{proposta.descricao}</p>
          )}
          <p><strong>Referência:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={proposta.referencia} 
              onChange={(e) => setProposta({ ...proposta, referencia: e.target.value })} 
            />
          ) : (
            <p>{proposta.referencia}</p>
          )}
        </div>
        <div className='box3'>
          <p><strong>Observação:</strong></p>
          {isEditing ? (
            <Input 
              type="text" 
              value={observacao} 
              onChange={(e) => setObservacao(e.target.value)} 
            />
          ) : (
            <p>{observacao}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <Button className='botaod' onClick={handleSaveClick}>Salvar</Button>
      )}

      <h2>Imagens</h2>
      {imagens.length > 0 ? (
        <div className="imagem-section">
          <div className='image-box'>
            {imagens.map((imagem, index) => (
              <div key={index} className="imagem" onClick={() => openModal(imagem)}>            
                <img src={`https://backend-5eid.onrender.com/get_imagem/${imagem.path}`} alt={imagem.descricao} width="250" height="250" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{alignSelf:'center'}}>Nenhuma imagem adicionada.</p>
      )}
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Imagem"
        className="Modal"
        overlayClassName="Overlay"
      >
        {currentImage && (
          <>
            <img src={`https://backend-5eid.onrender.com/get_imagem/${currentImage.path}`} alt={currentImage.descricao} style={{ width: 'auto', height:'70%' }} />
            <p>{currentImage.descricao}</p>
            <Button className='botaod' onClick={closeModal}>Fechar</Button>
          </>
        )}
      </Modal>

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
          <div className='botao-section'>
          <Button className='botaod' onClick={handleDeleteProposta}>Apagar Proposta</Button>
          </div>
    </div>
  );
};

export default FollowUp;
