const ExcelJS = require('exceljs')
const Vendas = require('../Models/Model_Venda');

module.exports = {
    homepage: (req, res) => {
        res.render('cadastro');
    },

    cadastroVenda: (req, res) => {
        let dataVenda = req.body.dataVenda;
        let numeroTitulo = req.body.numeroTitulo;
        let nomeTitular = req.body.nomeTitular;
        let cpfTitular = req.body.cpfTitular;
        let valorVenda = req.body.valorVenda.replace(',', '.');
        let consultor = req.body.consultor;
        let valorComissao = valorVenda * 0.015;
        valorComissao = Math.floor(valorComissao * 100) / 100;

        // > > Validação da data
        if (!dataVenda || dataVenda.length !== 10 || isNaN(Date.parse(dataVenda))) {
            return res.send('Data inválida');
        };

        Vendas.create({
            dataVenda: dataVenda,
            numeroTitulo: numeroTitulo,
            nomeTitular: nomeTitular,
            cpfTitular: cpfTitular,
            valorVenda: valorVenda,
            valorComissao: valorComissao,
            consultor: consultor
        }).then(() => {
            res.redirect('cadastro');
        }).catch((error) => {
            res.send(`Erro ao cadastrar dados: ${error}`);
        });
    },

    listaVendas: (req, res) => {
        Vendas.findAll({
            raw: true,
            order: [['dataVenda', 'ASC']]
        }).then(vendas => {
            // > Formata cada valor individualmente
            const vendasFormatadas = vendas.map(v => {
                return {
                    ...v,
                    valorVenda: parseFloat(v.valorVenda).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }),
                    valorComissao: parseFloat(v.valorComissao).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                };
            });

            // > Calcular e formatar comissão total
            let comissaoTotal = vendas.reduce((acc, v) => acc + parseFloat(v.valorComissao), 0);
            comissaoTotal = comissaoTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            res.render('lista_vendas', {
                venda: vendasFormatadas,
                comissaoTotal
            });
        }).catch((error) => {
            res.send(`Erro ao exibir lista de vendas: ${error}`);
        });
    },


    delVendas: (req, res) => {
        Vendas.destroy({
            where: {}
        }).then(() => {
            res.redirect('/lista_vendas')
        });
    },

    relatorioVendas: async (req, res) => {
        try {
            const nomesMeses = {
                '01': 'Janeiro',
                '02': 'Fevereiro',
                '03': 'Março',
                '04': 'Abril',
                '05': 'Maio',
                '06': 'Junho',
                '07': 'Julho',
                '08': 'Agosto',
                '09': 'Setembro',
                '10': 'Outubro',
                '11': 'Novembro',
                '12': 'Dezembro'
            };
            const hoje = new Date();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const ano = hoje.getFullYear();
            const nomeRelatorio = `Vendas_${nomesMeses[mes]}_${ano}`;

            const vendas = await Vendas.findAll({
                raw: true,
                order: [['dataVenda', 'ASC']]
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Vendas');

            worksheet.columns = [
                { header: 'DATA DA VENDA', key: 'dataVendaFormatada', width: 18 },
                { header: 'Nº DO TÍTULO', key: 'numeroTitulo', width: 15 },
                { header: 'TITULAR', key: 'nomeTitular', width: 30 },
                { header: 'CPF DO TITULAR', key: 'cpfTitular', width: 15 },
                { header: 'VALOR', key: 'valorVenda', width: 15 },
                { header: 'CONSULTOR', key: 'consultor', width: 20 },
                { header: 'COMISSAO', key: 'valorComissao', width: 15 },
                { header: 'TOTAL DE COMISSÃO', key: 'comissaoTotal', width: 20 }
            ];

            // > Negrito e centralizar cabeçalho
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.alignment = { horizontal: 'center' };

            let totalComissao = 0;
            let totalVendasCount = 0; // Contador de vendas

            vendas.forEach(venda => {
                const valorComissaoNum = parseFloat(venda.valorComissao);
                totalComissao += valorComissaoNum;
                totalVendasCount++; // Incrementa o contador de vendas

                const row = worksheet.addRow({
                    dataVendaFormatada: new Date(venda.dataVenda).toLocaleDateString('pt-BR'),
                    numeroTitulo: Number(venda.numeroTitulo),
                    nomeTitular: venda.nomeTitular,
                    cpfTitular: venda.cpfTitular,
                    valorVenda: parseFloat(venda.valorVenda),
                    consultor: venda.consultor,
                    valorComissao: valorComissaoNum,
                    comissaoTotal: ''
                });

                // > Centraliza células da linha
                row.eachCell(cell => {
                    cell.alignment = { horizontal: 'center' };
                });

                // > Formata valores monetários
                row.getCell('valorVenda').numFmt = '#,##0.00';
                row.getCell('valorComissao').numFmt = '#,##0.00';
            });

            // > 3 Linhas em branco
            worksheet.addRow({});
            worksheet.addRow({});
            worksheet.addRow({});

            // > Linha total de comissão
            const totalRow = worksheet.addRow({
                nomeTitular: 'TOTAL DE COMISSÃO',
                comissaoTotal: totalComissao
            });

            // > Centraliza a linha total de comissão
            totalRow.eachCell(cell => {
                cell.alignment = { horizontal: 'center' };
            });

            // > Formata valor total em moeda BRL
            totalRow.getCell('comissaoTotal').numFmt = '"R$"#,##0.00';

            // > Linha total de vendas
            const totalVendasRow = worksheet.addRow({
                nomeTitular: 'TOTAL DE VENDAS',
                comissaoTotal: totalVendasCount // Aqui você coloca o total de vendas
            });

            // > Centraliza a linha total de vendas
            totalVendasRow.eachCell(cell => {
                cell.alignment = { horizontal: 'center' };
            });

            // > Resposta com o arquivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${nomeRelatorio}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            res.send(`Erro ao gerar planilha: ${error}`);
        }
    },


    editarVenda: (req, res) => {
        const id = req.params.id
        Vendas.findByPk(id).then((venda) => {
            if (!venda) {
                return res.send('/404')
            }
            res.render('editar_venda', {
                venda: venda,
                id: id
            })
        }).catch((error) => {
            console.log(`Erro ao buscar informações da Venda: ${error}`)
            res.send(`/500: ${error}`)
        })
    },

    salvarEdicao: (req, res) => {
        const {
            idVenda,
            dataVenda,
            numeroTitulo,
            nomeTitular,
            cpfTitular,
            valorVenda,
            consultor
        } = req.body;

        let valorComissao = valorVenda * 0.015;
        valorComissao = Math.floor(valorComissao * 100) / 100;

        let novosDados = {
            id: idVenda,
            dataVenda: dataVenda,
            numeroTitulo: numeroTitulo,
            nomeTitular: nomeTitular,
            cpfTitular: cpfTitular,
            valorVenda: valorVenda.replace(',', '.'),
            valorComissao: valorComissao,
            consultor: consultor
        };

        Vendas.update(novosDados, {
            where: {
                id: idVenda
            }
        }).then(() => {
            console.log("\n✅ Informações alteradas com sucesso!");
            res.redirect('/lista_vendas');
        }).catch((error) => {
            console.log(`\n❌ Erro ao salvar informações: ${error}`);
            res.send(error);
        });
    }
};