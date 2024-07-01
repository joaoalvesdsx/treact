import React, { useState } from 'react';
import MapaInterativo from '../MapaInterativo';
import Header from '../commons/Header';
import '../styles/BuscarEmpresa.css';
import Input from '../commons/Input';
import Button from '../commons/Button';
import Table from '../commons/Table';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const BuscarEmpresa = () => {
  const [cnpj, setCnpj] = useState('');
  const [nome_empresa, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleBuscarCnpj = async () => {
    if (!cnpj) {
      setErrorMessage('Por favor, insira um CNPJ para buscar.');
      return;
    }
    try {
      const response = await api.get(`/listar_empresa_por_cnpj?cnpj=${cnpj}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      if (response.data) {
        setEmpresas([response.data]);
        setErrorMessage('');
      } else {
        setEmpresas([]);
        setErrorMessage('Nenhuma empresa encontrada com o CNPJ fornecido.');
      }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      setErrorMessage('Erro ao buscar empresa.');
    }
  };

  const handleBuscarNome = async () => {
    if (!nome_empresa) {
      setErrorMessage('Por favor, insira um nome para buscar.');
      return;
    }
    try {
      const response = await api.get(`/listar_empresas_por_nome?nome=${nome_empresa}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      if (response.data.length > 0) {
        setEmpresas([response.data]);
        setErrorMessage('');
      } else {
        setEmpresas([]);
        setErrorMessage('Nenhuma empresa encontrada com o nome fornecido.');
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      setErrorMessage('Erro ao buscar empresas.');
    }
  };

  const handleBuscarCidade = async () => {
    if (!cidade) {
      setErrorMessage('Por favor, insira uma cidade para buscar.');
      return;
    }
    try {
      const response = await api.get(`/listar_empresas_por_cidade?cidade=${cidade}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      if (response.data.length > 0) {
        setEmpresas(response.data);
        setErrorMessage('');
      } else {
        setEmpresas([]);
        setErrorMessage('Nenhuma empresa encontrada na cidade fornecida.');
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      setErrorMessage('Erro ao buscar empresas.');
    }
  };

  const handleRegionClick = async (regiao) => {
    try {
      const response = await api.get(`/listar_empresas_por_regiao?regiao=${regiao}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      console.log('Dados recebidos (Região):', response.data);
      if (response.data.length > 0) {
        setEmpresas(response.data);
        setErrorMessage('');
      } else {
        setEmpresas([]);
        setErrorMessage('Nenhuma empresa encontrada na região fornecida.');
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      setErrorMessage('Erro ao buscar empresas.');
    }
  };

  const handleRowClick = (row) => {
    navigate(`/empresa/${row.cnpj}`);
  };

  const columns = [
    { header: 'Nome', accessor: 'nome_empresa' },
    { header: 'CNPJ', accessor: 'cnpj' },
    { header: 'Razão Social', accessor: 'razao_social' },
    { header: 'Município', accessor: 'municipio' },
    { header: 'CEP', accessor: 'cep' },
    { header: 'Região', accessor: 'regiao' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <>
      <Header text="Buscar Empresa" showBackButton={true} />
      <div className="buscar-empresa">
        <div className="map-container">
          <MapaInterativo onRegionClick={handleRegionClick} />
        </div>
        <div className='forms'>
          <div className="busca-form">
            <Input
              type="text"
              placeholder="Buscar por CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <Button className='button' onClick={handleBuscarCnpj}>Buscar</Button>
          </div>
          <div className="busca-form">
            <Input
              type="text"
              placeholder="Buscar por Nome"
              value={nome_empresa}
              onChange={(e) => setNome(e.target.value)}
            />
            <Button className='button' onClick={handleBuscarNome}>Buscar</Button>
          </div>
          <div className="busca-form">
            <Input
              type="text"
              placeholder="Buscar por Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
            <Button className='button' onClick={handleBuscarCidade}>Buscar</Button>
          </div>
        </div>
      </div>
      <div className="resultados">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {empresas.length > 0 && <Table columns={columns} data={empresas} onRowClick={handleRowClick} />}
      </div>
    </>
  );
};

export default BuscarEmpresa;
