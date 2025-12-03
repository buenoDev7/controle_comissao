const Sequelize = require('sequelize');
const connection = require('../database/db_connection');
const vendas = connection.define('info_vendas', {
    dataVenda: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O campo não pode ser vazio"
            }
        }
    },

    numeroTitulo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O campo não pode ser vazio"
            }
        }
    },

    valorVenda: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O campo não pode ser vazio"
            }
        }
    },

    valorComissao: {
        type: Sequelize.DECIMAL(10, 2)
    }
},
    {
        freezeTableName: true
    }
);

vendas.sync({ force: false }).then(() => {
    console.log(`\n♻️  Tabela '${vendas.tableName}' sincronizada!`)
}).catch((error) => {
    console.log(`\n❌ Erro ao sincronizar tabela: ${error}`)
});
module.exports = vendas;