// > .env
require('dotenv').config();

// > Express.js
const express = require('express');
const app = express();

// > Conexão com Banco de Dados
const connection = require('./database/db_connection')
connection.authenticate().then(() => {
    console.log('\n✅ Banco de dados conectado com sucesso')
}).catch((error) => {
    console.log(`\n❌ Erro ao conectar com banco de dados: ${error}`)
});

// > body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// > EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// > Routers
const routerCadastro = require('./Routes/routerCadastro');
app.use('/', routerCadastro);

// > PORT do Servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`\n✅ Servidor conectado na porta > '${PORT}'`);
});