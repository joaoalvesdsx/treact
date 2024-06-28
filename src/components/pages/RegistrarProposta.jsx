import React, { useState, useEffect,useCallback } from 'react';
import api from '../../api';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import Table from '../commons/Table';
import '../styles/RegistrarProposta.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegistrarProposta = () => {
  const [referencia, setReferencia] = useState('');
  const [data, setData] = useState('');
  const [observacao, setObservacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cnpj_empresa, setCnpjEmpresa] = useState('');
  const [propostas, setPropostas] = useState([]);
  const [empresas, setEmpresas] = useState({});
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { auth } = useAuth();

  

  const fetchData = useCallback(async () => {
    try {
      const responsePropostas = await api.get('/listar_todas_propostas', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      const propostas = responsePropostas.data;
      propostas.reverse();
      setPropostas(propostas);
      const empresaCNPJs = [...new Set(propostas.map(proposta => proposta.cnpj_empresa))];
      const empresaResponses = await Promise.all(
        empresaCNPJs.map(cnpj => api.get(`/listar_empresa_por_cnpj?cnpj=${cnpj}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }))
      );
      const empresaData = empresaResponses.reduce((acc, res) => {
        acc[res.data.cnpj] = res.data.nome_empresa;
        return acc;
      }, {});
      setEmpresas(empresaData);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
    }
  },[auth.token]);

  useEffect(() => {
    fetchData();
  },[fetchData], [auth.token]);
  
  const validate = () => {
    const newErrors = {};
    if (!referencia) newErrors.referencia = 'Referência é obrigatória';
    if (!data) newErrors.data = 'Data é obrigatória';
    if (!descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!cnpj_empresa) newErrors.cnpj_empresa = 'CNPJ da empresa é obrigatório';
    return newErrors;
  };

  const handleRegistrarProposta = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const novaProposta = {
      referencia,
      data,
      observacao,
      descricao,
      status: 'Aberta',
      cnpj_empresa
    };

    try {
      await api.post('/registrar_proposta', novaProposta, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      fetchData();
      setReferencia('');
      setData('');
      setObservacao('');
      setDescricao('');
      setCnpjEmpresa('');
      setErrors({});
    } catch (error) {
      console.error('Erro ao registrar proposta:', error);
    }
  };

  const handleStatusChange = async (_id, newStatus) => {
    try {
      await api.post('/atualizar_status_proposta', { _id, status: newStatus }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleClearFilters = () => {
    setFiltroStatus('Todos');
    setFiltroDataInicio('');
    setFiltroDataFim('');
  };

  const handleRowClick = (row) => {
    navigate(`/followup/${row._id}`);
  };

  const filteredPropostas = propostas.filter(proposta => {
    const isStatusMatch = filtroStatus === 'Todos' || proposta.status === filtroStatus;
    const isDataMatch = (!filtroDataInicio || new Date(proposta.data) >= new Date(filtroDataInicio)) &&
                        (!filtroDataFim || new Date(proposta.data) <= new Date(filtroDataFim));
    return isStatusMatch && isDataMatch;
  });

  const columns = [
    { header: 'Número', accessor: '_id' },
    { header: 'Data', accessor: 'data' },
    { header: 'Cliente', accessor: 'cnpj_empresa', Cell: ({ value }) => empresas[value] || value },
    { header: 'Descrição', accessor: 'descricao' },
    { header: 'Observação', accessor: 'observacao' },
    { header: 'Status', accessor: 'status', Cell: ({ row }) => (
        <select
          value={row.original.status || ''}
          onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
        >
          <option value="Aberto">Aberto</option>
          <option value="Fechado">Fechado</option>
          <option value="Pendente">Pendente</option>
        </select>
      )
    },
  ];

  return (
    <>
      <Header text="Propostas" showBackButton={true} />
      <div className="registrar-proposta">
        <h2>Propostas</h2>
        <div className="form-row">
          <Input 
            classname="input-forms"
            type="text"
            placeholder="Referência"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          {errors.referencia && <span className="error">{errors.referencia}</span>}
          <Input 
            classname="input-forms"
            type="date"
            placeholder="Data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          {errors.data && <span className="error">{errors.data}</span>}
        </div>
        <div className="form-row">
          <Input 
            classname="input-forms"
            type="text"
            placeholder="CNPJ Empresa"
            value={cnpj_empresa}
            onChange={(e) => setCnpjEmpresa(e.target.value)}
          />
          {errors.cnpj_empresa && <span className="error">{errors.cnpj_empresa}</span>}
          <Input 
            classname="input-forms"
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
          <Input 
            classname="input-forms"
            type="text"
            placeholder="Descrição - Produto, serviço"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {errors.descricao && <span className="error">{errors.descricao}</span>}
        </div>
        <div className="form-row">
          <Button className='button-form' onClick={handleRegistrarProposta}>Registrar</Button>
        </div>
        <h4 className='H4'>Filtros : </h4>
        <div className="resultados">
          <div className='filtros'> 
            <div className="filtro-status">
            Status : 
            <select className='filtro'
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option className='filtro' value="Todos">Todos</option>
              <option className='filtro' value="Aberto">Aberto</option>
              <option className='filtro' value="Fechado">Fechado</option>
              <option className='filtro' value="Pendente">Pendente</option>
            </select>
          </div>
          <div className="filtro-data">
            Data Inicial :
            <Input 
              classname="input-forms"
              type="date"
              placeholder="Data Início"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
            />
            Data Final :
            <Input 
              classname="input-forms"
              type="date"
              placeholder="Data Fim"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
            />
          </div>
          <Button className='button-filtro' onClick={handleClearFilters}>Limpar Filtros</Button>
          </div>
          {filteredPropostas.length > 0 && (
            <Table columns={columns} data={filteredPropostas} onRowClick={handleRowClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default RegistrarProposta;
