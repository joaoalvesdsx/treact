import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/pages/Login';
import ListarEmpresas from './components/pages/ListarEmpresas';
import RegistrarProposta from './components/pages/RegistrarProposta';
import BuscarEmpresa from './components/pages/BuscarEmpresa';
import CadastrarEmpresa from './components/pages/CadastrarEmpresa';
import Empresa from './components/pages/Empresa';
import Menu from './components/pages/Menu';
import RegistrarContato from './components/pages/RegistrarContato';
import DetalhesProposta from './components/pages/DetalhesPropostas';
import Followup from './components/pages/Followup';
import Servicos from './components/pages/Servicos';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route exact path="/" element={<Login />} />
        <Route element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
          <Route path="/listar-empresas" element={<PrivateRoute><ListarEmpresas /></PrivateRoute>} />
          <Route path="/registrar-proposta" element={<PrivateRoute><RegistrarProposta /></PrivateRoute>} />
          <Route path="/buscar-empresa" element={<PrivateRoute><BuscarEmpresa /></PrivateRoute>} />
          <Route path="/cadastrar-empresa" element={<PrivateRoute><CadastrarEmpresa /></PrivateRoute>} />
          <Route path="/empresa/:cnpj" element={<PrivateRoute><Empresa /></PrivateRoute>} />
          <Route path="/registrar-contato" element={<PrivateRoute><RegistrarContato /></PrivateRoute>} />
          <Route path="/detalhes-proposta/:id" element={<PrivateRoute><DetalhesProposta /></PrivateRoute>} />
          <Route path="/followup/:_id" element={<PrivateRoute><Followup /></PrivateRoute>} />
          <Route path="/servicos" element={<PrivateRoute><Servicos /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
