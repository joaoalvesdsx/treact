import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import Table from '../commons/Table';
import ContactCard from '../commons/ContactCard'
import '../styles/EmpresaDetails.css';
import { useAuth } from '../../context/AuthContext';

const EmpresaDetails = () => {
  const { auth } = useAuth();
  const { cnpj } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState({});
  const [contatos, setContatos] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [status, setStatus] = useState('');
  const [ultimaVenda, setUltimaVenda] = useState('');
  const [ultimaVisita, setUltimaVisita] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddVisita, setShowAddVisita] = useState(false);
  const [newContact, setNewContact] = useState({
    nome: '',
    funcao: '',
    telefone: '',
    celular: '',
    email: ''
  });
  const [newVisita, setNewVisita] = useState({
    tipo: '',
    descricao: ''
  });
  const [selectedTipo, setSelectedTipo] = useState('');

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const empresaResponse = await api.get(`/listar_empresa_por_cnpj?cnpj=${cnpj}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const contatosResponse = await api.get(`/listar_contato_por_cnpj?cnpj=${cnpj}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const propostasResponse = await api.get(`/listar_proposta_por_cnpj?cnpj=${cnpj}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const visitasResponse = await api.get(`/listar_visitas_por_cnpj?cnpj=${cnpj}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        const proposta = propostasResponse.data;
        proposta.reverse();
        setEmpresa(empresaResponse.data);
        setContatos(contatosResponse.data);
        setPropostas(propostasResponse.data);
        setVisitas(visitasResponse.data);
        setStatus(empresaResponse.data.status);
        setUltimaVenda(empresaResponse.data.ultimaVenda);
        setUltimaVisita(empresaResponse.data.ultimaVisita);
      } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error);
      }
    };

    fetchEmpresaData();
  }, [cnpj, auth.token]);

  const handleStatusToggle = () => {
    const novoStatus = status === 'Ativo' ? 'Inativo' : 'Ativo';
    setStatus(novoStatus);
    api.post(`/atualizar_status_empresa`, { cnpj, status: novoStatus }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
  };

  const handleUltimaVendaChange = (e) => setUltimaVenda(e.target.value);
  const handleUltimaVisitaChange = (e) => setUltimaVisita(e.target.value);

  const handleUltimaVendaBlur = () => {
    api.post(`/atualizar_ultima_venda`, { cnpj, ultimaVenda }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
  };

  const handleUltimaVisitaBlur = () => {
    api.post(`/atualizar_ultima_visita`, { cnpj, ultimaVisita }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
  };

  const handleAddContact = async () => {
    if (!newContact.nome || !newContact.funcao || !newContact.telefone || !newContact.celular || !newContact.email) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/cadastrar_contato', { ...newContact, cnpj_empresa: cnpj }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setContatos([...contatos, { ...newContact, _id: response.data._id }]);
      setShowAddContact(false);
      setNewContact({ nome: '', funcao: '', telefone: '', celular: '', email: '' });
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
    }
  };

  const handleDeleteContact = async (_id) => {
    if (window.confirm('Você realmente quer excluir este contato?')) {
      try {
        await api.delete(`/deletar_contato`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          },
          data: { _id }
        });
        setContatos(contatos.filter(contato => contato._id !== _id));
      } catch (error) {
        console.error('Erro ao deletar contato:', error);
      }
    }
  };

  const handleAddVisita = async () => {
    if (!newVisita.tipo || !newVisita.descricao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const data = new Date().toLocaleDateString('pt-BR'); // Formatar a data como dd/mm/aaaa
    const novaVisita = { ...newVisita, data, cnpj_empresa: cnpj };

    try {
      const response = await api.post('/cadastrar_visita', novaVisita, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setVisitas([...visitas, response.data]);
      setShowAddVisita(false);
      setNewVisita({ tipo: '', descricao: '' });
      setSelectedTipo('');
    } catch (error) {
      console.error('Erro ao adicionar visita:', error);
    }
  };

  const handleDeleteEmpresa = async () => {
    if (window.confirm('Você realmente quer excluir esta empresa?')) {
      try {
        await api.delete(`/deletar_empresa`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          },
          data: { cnpj }
        });
        setPropostas(propostas.filter(proposta => proposta.cnpj_empresa !== cnpj));
        navigate('/listar-empresas');
      } catch (error) {
        console.error('Erro ao deletar empresa:', error);
      }
    }
  };

  const handleRowClick = (row) => {
    navigate(`/followup/${row._id}`);
  };

  const propostasColumns = [
    { header: 'Data', accessor: 'data' },
    { header: 'Status', accessor: 'status' },
    { header: 'Descrição', accessor: 'descricao' },
    { header: 'Último Status', accessor: 'observacao' }
  ];

  return (
    <div className="empresa-details">
      <Header text="Empresas" showBackButton={true} />
      <div className='flex-container'>
        <div className="empresa-info">
          <div className='dados-main'>
            <h1>{empresa.nome_empresa}</h1>
            <div className='dados'>
              <p>{empresa.razao_social}</p>
              <p>CNPJ: {empresa.cnpj}</p>
              <p>Município: {empresa.municipio}</p>
              <p>CEP: {empresa.cep}</p>
              <p>Região: {empresa.regiao}</p>
            </div>
          </div>

          <div className='dados-att'>
            <button className="delete-button" onClick={handleDeleteEmpresa}>X</button>
            <button className={`status-button ${status.toLowerCase()}`} onClick={handleStatusToggle}>
              {status}
            </button>
            <div className='datas'>
              <label>Última venda: </label>
              <input className='dt' type="date" value={ultimaVenda} onChange={handleUltimaVendaChange} onBlur={handleUltimaVendaBlur} />
            </div>
            <div>
              <label className='datas'>Última visita: </label>
              <input className='dt' type="date" value={ultimaVisita} onChange={handleUltimaVisitaChange} onBlur={handleUltimaVisitaBlur} />
            </div>
            
          </div>
        </div>

        <div className="contatos-container">
          {contatos.map(contato => (
            <ContactCard
              key={contato._id}
              id={contato._id}
              name={contato.nome}
              funcao={contato.funcao}
              phone={contato.telefone}
              email={contato.email}
              cellphone={contato.celular}
              onDelete={() => handleDeleteContact(contato._id)}
            />
          ))}
          <div className="add-contact-button" onClick={() => setShowAddContact(true)}>
            +
          </div>
        </div>

        <div className="botoes-contato">
          <button onClick={() => setShowAddVisita(true)}>Visita / Contato</button>
        </div>

        {showAddContact && (
          <div className="add-contact-modal">
            <div className="modal-content">
              <h3>Adicionar Contato</h3>
              <Input
                className="input-add"
                type="text"
                placeholder="Nome"
                value={newContact.nome}
                onChange={(e) => setNewContact({ ...newContact, nome: e.target.value })}
              />
              <Input
                className="input-add"
                type="text"
                placeholder="Função"
                value={newContact.funcao}
                onChange={(e) => setNewContact({ ...newContact, funcao: e.target.value })}
              />
              <Input
                className="input-add"
                type="text"
                placeholder="Telefone"
                value={newContact.telefone}
                onChange={(e) => setNewContact({ ...newContact, telefone: e.target.value })}
              />
              <Input
                className="input-add"
                type="text"
                placeholder="Celular"
                value={newContact.celular}
                onChange={(e) => setNewContact({ ...newContact, celular: e.target.value })}
              />
              <Input
                className="input-add"
                type="text"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <Button className='button-contact' onClick={handleAddContact}>Salvar</Button>
              <Button className='button-contact' onClick={() => setShowAddContact(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {showAddVisita && (
          <div className="add-contact-modal">
            <div className="modal-content-visita">
              <h3>Visita/Contato</h3>
              <div className="visitas-section">
                {visitas.map(visita => (
                  <div className='visita' key={visita._id}>
                    <p className='titulo '>{visita.tipo} - {visita.data} </p>
                    <p className='descricao'>{visita.descricao}</p>
                  </div>
                ))}
              </div>
              <div className="botoes-tipo">
                <Button
                  className={`botao-tipo ${selectedTipo === 'Visita' ? 'selected' : ''}`}
                  onClick={() => {
                    setNewVisita({ ...newVisita, tipo: 'Visita' });
                    setSelectedTipo('Visita');
                  }}
                >
                  Visita
                </Button>
                <Button
                  className={`botao-tipo ${selectedTipo === 'Contato' ? 'selected' : ''}`}
                  onClick={() => {
                    setNewVisita({ ...newVisita, tipo: 'Contato' });
                    setSelectedTipo('Contato');
                  }}
                >
                  Contato
                </Button>
                <Input
                  className="input-add"
                  type="text"
                  placeholder="Descrição"
                  value={newVisita.descricao}
                  onChange={(e) => setNewVisita({ ...newVisita, descricao: e.target.value })}
                />
              </div>

              <div className='botoes-tipo-2'>
                <Button className='botao-f' onClick={handleAddVisita}>Salvar</Button>
                <Button className='botao-f' onClick={() => setShowAddVisita(false)}>Cancelar</Button>
              </div>
            </div>
          </div>
        )}

        <div className="propostas-section">

          <h2 className='proposta-titulo'>Propostas</h2>
          <Table columns={propostasColumns} data={propostas} onRowClick={handleRowClick} />
        </div>

      </div>
    </div>
  );
};

export default EmpresaDetails;
