import React, { useState } from 'react';
import MapaInterativo from '../MapaInterativo';
import Header from '../commons/Header';
import '../styles/BuscarEmpresa.css'; // Importa o CSS aqui
import Input from '../commons/Input';
import Button from '../commons/Button';
import Table from '../commons/Table';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const BuscarEmpresa = () => {
  const [cnpj, setCnpj] = useState('');
  const [nome_empresa, setNome] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleBuscarCnpj = async () => {
    try {
      const response = await api.get(`/listar_empresa_por_cnpj?cnpj=${cnpj}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setEmpresas([response.data]);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
    }
  };

  const handleBuscarNome = async () => {
    try {
      const response = await api.get(`/listar_empresas_por_nome?nome=${nome_empresa}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
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
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
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
        </div>
      </div>
      <div className="resultados">
        {empresas.length > 0 && <Table columns={columns} data={empresas} onRowClick={handleRowClick} />}
      </div>
    </>
  );
};

export default BuscarEmpresa;
