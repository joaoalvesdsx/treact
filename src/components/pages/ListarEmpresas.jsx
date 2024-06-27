import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../commons/Table'; // Importando o componente de tabela
import Header from '../commons/Header';
import '../styles/ListarEmpresa.css';
import { useNavigate } from 'react-router-dom';
import Button from '../commons/Button';
import { useAuth } from '../../context/AuthContext';
function ListarEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroRegiao, setFiltroRegiao] = useState('Todos');
  const navigate = useNavigate();
  const {auth} = useAuth();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/listar_todas_empresas',{headers: {
          Authorization: `Bearer ${auth.token}`
        }});
        setEmpresas(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    };

    fetchEmpresas();
  }, [auth.token]);

  const handleRowClick = (row) => {
    navigate(`/empresa/${row.cnpj}`);
  };

  const handleClearFilters = () => {
    setFiltroStatus('Todos');
    setFiltroRegiao('Todos');
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const isStatusMatch = filtroStatus === 'Todos' || empresa.status === filtroStatus;
    const isRegiaoMatch = filtroRegiao === 'Todos' || empresa.regiao === filtroRegiao;
    return isStatusMatch && isRegiaoMatch;
  });

  const columns = [
    { header: 'Nome', accessor: 'nome_empresa' },
    { header: 'Município', accessor: 'municipio' },
    { header: 'Região', accessor: 'regiao' },
    { header: 'Situação', accessor: 'status' }
  ];

  return (
    <>
      <Header text="Empresas" showBackButton={true} />
      <div className="listar-empresas">
        
        <div className="filtros">
        <h4>Filtros : </h4>
          <div>
            Situação :
          <select 
            className='filtro'
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option className='filtro' value="Todos">Todos</option>
            <option className='filtro' value="Ativo">Ativo</option>
            <option className='filtro' value="Inativo">Inativo</option>
          </select>
          </div>
          <div>
            Região :
            <select
              className='filtro'
              value={filtroRegiao}
              onChange={(e) => setFiltroRegiao(e.target.value)}
            >
              <option className='filtro' value="Todos">Todos</option>
              <option className='filtro' value="71">71</option>
              <option className='filtro' value="73">73</option>
              <option className='filtro' value="74">74</option>
              <option className='filtro' value="75">75</option>
              <option className='filtro' value="77">77</option>
              <option className='filtro' value="79">79</option>
            </select>
          </div>
          <Button className="button-filtro" onClick={handleClearFilters}>Limpar Filtros</Button>
        </div>
        <Table columns={columns} data={filteredEmpresas} onRowClick={handleRowClick} />
      </div>
    </>
  );
}

export default ListarEmpresas;
