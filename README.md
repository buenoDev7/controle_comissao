# 💼 Sistema de Gestão de Comissões

Este projeto é um sistema completo de gerenciamento de vendas e comissões desenvolvido com **Node.js**, **Express**, **Sequelize**, **MySQL**, **EJS** e **Bootstrap**. 
Ele permite registrar, listar, editar e excluir vendas, além de gerar relatórios mensais no formato `.xlsx`.

---

## 🧠 Tecnologias Utilizadas

- Node.js
- Express
- EJS
- Sequelize
- MySQL
- ExcelJS
- Bootstrap 5
- HTML/CSS (Customizado)

---

## 🧩 Arquitetura do Projeto

O sistema segue o padrão **MVC + Routers**, estruturado da seguinte forma:

📁 project-root/
│
├── 📁 Controllers/
│ └── ControllerCadastro.js
│
├── 📁 Models/
│ └── Model_Venda.js
│
├── 📁 Routes/
│ └── routerCadastro.js
│
├── 📁 Views/
│ ├── cadastro.ejs
│ ├── editar_venda.ejs
│ └── lista_vendas.ejs
│
├── 📁 public/
│ ├── 📁 css/
│ │ └── cadastro.css
│ └── 📁 img/
│ └── favicon.png / edit-icon.png / wpp_cadastro.png
│
├── 📁 database/
│ └── db_connection.js
│
├── index.js
└── package.json

## 📌 Funcionalidades
## ➕ Cadastro de Vendas
→ Data da venda
→ Número do título
→ Nome e CPF do titular
→ Valor da venda
→ Consultor responsável
→ A comissão é calculada automaticamente como 1,5% do valor da venda.

### 📋 Listagem de Vendas
→ Visualização em formato de accordion
→ Quantidade total de vendas e valor total de comissão
→ Formatação monetária e de datas em padrão pt-BR

### ✏️ Edição de Vendas
→ Permite atualizar todos os campos de uma venda
→ Recalcula a comissão com base no novo valor

### 🗑️ Deleção de Registros
→ Botão para limpar todas as vendas

### 📤 Exportação de Relatórios
#### Gera um arquivo .xlsx com:
→ Todas as vendas do mês
→ Total de comissões
→ Total de vendas

## 📦 Dependências Principais
"dependencies": {
  "body-parser": "^1.20.2",
  "ejs": "^3.1.9",
  "exceljs": "^4.4.0",
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "sequelize": "^6.35.1"
}

## 🛠️ Estrutura de Banco de Dados
→ Tabela: info_vendas

*Campo*          	  *TIPO*          	    *DESCRIÇÃO*
id	              INTEGER	PK,           autoincrement
dataVenda	          DATEONLY	            Data da venda
numeroTitulo	      INTEGER	        Número identificador do título
nomeTitular         STRING	          Nome do comprador
cpfTitular	        STRING	            CPF formatado
consultor	          STRING	           Nome do consultor
valorVenda	      DECIMAL(10,2)	    Valor da venda em reais
valorComissao	    DECIMAL(10,2)	        Comissão de 1,5%


## 👤 Autor
Desenvolvido por Yan Bueno
🔗 Projeto fullstack com Node.js, Express, Sequelize, EJS e Bootstrap

##📄 Licença
Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e distribuir conforme necessário.








