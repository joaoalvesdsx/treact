import React, { useState } from 'react';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Button from '../commons/Button';
import '../styles/CadastrarEmpresa.css'; // Importa o CSS para estilização
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const CadastrarEmpresa = () => {
  const [empresa, setEmpresa] = useState({
    razao_social: '',
    nome_empresa: '',
    cnpj: '',
    regiao: '',
    municipio: '',
    cep: ''
  });

  const [contato, setContato] = useState({
    nome: '',
    funcao: '',
    email: '',
    telefone: '',
    celular: '',
    observacao: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { auth } = useAuth();

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleContatoChange = (e) => {
    const { name, value } = e.target;
    setContato({
      ...contato,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    // Validação da empresa
    if (!empresa.razao_social) tempErrors.razao_social = "Razão Social é obrigatória";
    if (!empresa.nome_empresa) tempErrors.nome_empresa = "Nome Fantasia é obrigatório";
    if (!empresa.cnpj || !/^\d{14}$/.test(empresa.cnpj)) tempErrors.cnpj = "CNPJ inválido. Deve ter 14 dígitos";
    if (!empresa.regiao) tempErrors.regiao = "Região é obrigatória";
    if (!empresa.municipio) tempErrors.municipio = "Município é obrigatório";
    if (!empresa.cep || !/^\d{5}-\d{3}$/.test(empresa.cep)) tempErrors.cep = "CEP inválido. Deve estar no formato 00000-000";

    // Validação do contato
    if (!contato.nome) tempErrors.contato_nome = "Nome do contato é obrigatório";
    if (!contato.funcao) tempErrors.contato_funcao = "Função do contato é obrigatória";
    if (!contato.email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(contato.email)) tempErrors.contato_email = "E-mail inválido";
    if (!contato.telefone) tempErrors.contato_telefone = "O Telefone  é obrigatório";
    if (!contato.celular || !/^\d{11}$/.test(contato.celular)) tempErrors.contato_celular = "Celular inválido. Deve ter 11 dígitos";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await api.post('/cadastrar_empresa', empresa, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        await api.post('/cadastrar_contato', {
          ...contato,
          cnpj_empresa: empresa.cnpj // Relaciona o contato com a empresa
        }, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        alert('Empresa e Contato cadastrados com sucesso!');
        // Limpar os campos do formulário
        setEmpresa({
          razao_social: '',
          nome_empresa: '',
          cnpj: '',
          regiao: '',
          municipio: '',
          cep: ''
        });
        setContato({
          nome: '',
          funcao: '',
          email: '',
          telefone: '',
          celular: '',
          observacao: ''
        });
        setErrors({});
        setServerError('');
      } catch (error) {
        console.error('Erro ao cadastrar empresa e contato:', error);
        setServerError(error.response.data.error || 'Erro ao cadastrar empresa e contato');
      }
    }
  };

  return (
    <>
      <Header text="Cadastrar Empresa" showBackButton={true} />
      <div className="cadastrar-empresa-container">
        {serverError && <div className="error-server">{serverError}</div>}
        <h2>Empresa:</h2>
        <div className="empresa-form">
          <div className="input-group">
            <Input
              type="text"
              name="razao_social"
              placeholder="Razão Social"
              value={empresa.razao_social}
              onChange={handleEmpresaChange}
            />
            {errors.razao_social && <span className="error">{errors.razao_social}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="nome_empresa"
              placeholder="Nome Fantasia"
              value={empresa.nome_empresa}
              onChange={handleEmpresaChange}
            />
            {errors.nome_empresa && <span className="error">{errors.nome_empresa}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="cnpj"
              placeholder="CNPJ"
              value={empresa.cnpj}
              onChange={handleEmpresaChange}
            />
            {errors.cnpj && <span className="error">{errors.cnpj}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="regiao"
              placeholder="Região"
              value={empresa.regiao}
              onChange={handleEmpresaChange}
            />
            {errors.regiao && <span className="error">{errors.regiao}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="municipio"
              placeholder="Município"
              value={empresa.municipio}
              onChange={handleEmpresaChange}
            />
            {errors.municipio && <span className="error">{errors.municipio}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="cep"
              placeholder="CEP"
              value={empresa.cep}
              onChange={handleEmpresaChange}
            />
            {errors.cep && <span className="error">{errors.cep}</span>}
          </div>
        </div>
        <h2>Contato:</h2>
        <div className="contato-form">
          <div className="input-group">
            <Input
              type="text"
              name="nome"
              placeholder="Nome"
              value={contato.nome}
              onChange={handleContatoChange}
            />
            {errors.contato_nome && <span className="error">{errors.contato_nome}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="funcao"
              placeholder="Função"
              value={contato.funcao}
              onChange={handleContatoChange}
            />
            {errors.contato_funcao && <span className="error">{errors.contato_funcao}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="email"
              placeholder="E-mail"
              value={contato.email}
              onChange={handleContatoChange}
            />
            {errors.contato_email && <span className="error">{errors.contato_email}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={contato.telefone}
              onChange={handleContatoChange}
            />
            {errors.contato_telefone && <span className="error">{errors.contato_telefone}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="celular"
              placeholder="Celular"
              value={contato.celular}
              onChange={handleContatoChange}
            />
            {errors.contato_celular && <span className="error">{errors.contato_celular}</span>}
          </div>
          <div className="input-group">
            <Input
              type="text"
              name="observacao"
              placeholder="Observação"
              value={contato.observacao}
              onChange={handleContatoChange}
            />
          </div>
        </div>
        <Button className='button-forms' onClick={handleSubmit}>Cadastrar</Button>
      </div>
    </>
  );
};

export default CadastrarEmpresa;
