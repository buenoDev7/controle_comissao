const Sequelize = require('sequelize');
const connection = new Sequelize('comissao_yan', 'root', '@Yan2004', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
