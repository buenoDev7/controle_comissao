const express = require('express');
const router = express.Router();
const ControllerCadastro = require('../Controllers/ControllerCadastro');

// > Homepage para cadastro de informações da venda
router.get('/cadastro', ControllerCadastro.homepage);

// > Form de cadastro das informações
router.post('/cadastrar_venda', ControllerCadastro.cadastroVenda);;

// > Lista de vendas
router.get('/lista_vendas', ControllerCadastro.listaVendas);

// > Deletar vendas
router.post('/del_vendas', ControllerCadastro.delVendas);

// > Relatório de Vendas
router.post('/relatorio_vendas', ControllerCadastro.relatorioVendas);

// > Editar informações da venda
router.get('/editar_venda/:id', ControllerCadastro.editarVenda);

// > Persistir alteração das informações
router.post('/salvar_edicao', ControllerCadastro.salvarEdicao);

module.exports = router;