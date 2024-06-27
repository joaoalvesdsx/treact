import React from 'react';

function RegistrarContato() {
  return (
    <div>
      <h1>Registrar Contato</h1>
      <form>
        <div>
          <label>CNPJ da Empresa:</label>
          <input type="text" name="cnpj_empresa" />
        </div>
        <div>
          <label>Nome:</label>
          <input type="text" name="nome" />
        </div>
        <div>
          <label>Número:</label>
          <input type="text" name="numero" />
        </div>
        <div>
          <label>Função:</label>
          <input type="text" name="funcao" />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default RegistrarContato;
