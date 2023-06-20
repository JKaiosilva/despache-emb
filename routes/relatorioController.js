const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

require('../models/Aviso')
require('../models/Despacho')
require('../models/AvisoEntrada')
require('../models/AvisoSaida')
require('../models/Tripulante')
require('../models/Porto');
require('../models/Relatorio');
require('../models/Comboio')

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')
const Comboio = mongoose.model('comboios')

const { Admin } = require('../helpers/eAdmin')
const { eUser } = require('../helpers/eUser')

const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


//----    Rota para gerar Relatório    ----//


router.get('/admin/relatorioSaidas', Admin, async (req, res) => {
    try {
        const despachos = await Despacho.find().lean();
        const avisoEntradas = await AvisoEntrada.find().lean();
        const avisoSaidas = await AvisoSaida.find().lean();
        const embarcacoes = await Embarcacao.find().lean();
        const avisos = await Aviso.find().lean();
        const usuarios = await Usuario.find().lean();
        const tripulantes = await Tripulante.find().lean();


        let despachosCount = despachos.length;
        let avisoEntradasCount = avisoEntradas.length;
        let avisoSaidasCount = avisoSaidas.length;
        let embarcacoesCount = embarcacoes.length;
        let avisosCount = avisos.length;
        let usuariosCount = usuarios.length;
        let tripulantesCount = tripulantes.length;


        mesAnoAtual = moment(Date.now()).format('MM/YYYY')
        mesAtualString = moment(Date.now()).format('MMMM')

        bandeirasTotal = ['Paraguaio', 'Argentino', 'Uruguaio', 'Boliviano', 'Brasileiro']
        bandeirasExt = ['Paraguaio', 'Argentino', 'Uruguaio', 'Boliviano']
        bandeirasBRA = ['Brasileiro']
        bandeirasBO = ['Boliviano']
        bandeirasPA = ['Paraguai']
        bandeirasARG = ['Argentino']
        bandeirasURU = ['Uruguaio']

        mesEmbarcacaoTotal = 0
        mesEmbarcacaoExt = 0
        mesEmbarcacaoBRA = 0
        mesEmbarcacaoBO = 0
        mesEmbarcacaoPA = 0
        mesEmbarcacaoARG = 0
        mesEmbarcacaoURU = 0

        mesEmbarcacaoInternacionalEmp = 0
        mesEmbarcacaoNacionalEmp = 0
        mesEmbarcacaoBarcaca = 0
        mesEmbarcacaoRebocadorEmpurador = 0
        mesEmbarcacaoBalsa = 0
        mesEmbarcacaoCargaGeral = 0
        mesEmbarcacaoDraga = 0
        mesEmbarcacaoLancha = 0
        mesEmbarcacaoPassageiros = 0
        mesPassageiros = 0

        documentSaidaMesAnoAtual = 0

        totalEmbarcacaoTotal = 0
        totalEmbarcacaoExt = 0
        totalEmbarcacaoBRA = 0
        totalEmbarcacaoBO = 0
        totalEmbarcacaoPA = 0
        totalEmbarcacaoARG = 0
        totalEmbarcacaoURU = 0
        totalEmbarcacaoInternacionalEmp = 0
        totalEmbarcacaoNacionalEmp = 0
        totalEmbarcacaoBarcaca = 0
        totalEmbarcacaoRebocadorEmpurador = 0
        totalEmbarcacaoBalsa = 0
        totalEmbarcacaoCargaGeral = 0
        totalEmbarcacaoDraga = 0
        totalEmbarcacaoLancha = 0
        totalEmbarcacaoPassageiros = 0
        totalPassageiros = 0

        saidaTotalEmbarcacaoTotal = 0
        saidaTotalEmbarcacaoExt = 0
        saidaTotalEmbarcacaoBRA = 0
        saidaTotalEmbarcacaoBO = 0
        saidaTotalEmbarcacaoPA = 0
        saidaTotalEmbarcacaoARG = 0
        saidaTotalEmbarcacaoURU = 0

        saidaTotalEmbarcacaoInternacionalEmp = 0
        saidaTotalEmbarcacaoNacionalEmp = 0
        saidaTotalEmbarcacaoBarcaca = 0
        saidaTotalEmbarcacaoRebocadorEmpurador = 0
        saidaTotalEmbarcacaoBalsa = 0
        saidaTotalEmbarcacaoCargaGeral = 0
        saidaTotalEmbarcacaoDraga = 0
        saidaTotalEmbarcacaoLancha = 0
        saidaTotalEmbarcacaoPassageiros = 0

        var mesDespachosCount = despachos.filter((el) => el.depachoMesAnoAtual == mesAnoAtual).length
        var mesAvisoEntradasCount = avisoEntradas.filter((el) => el.entradaMesAnoAtual == mesAnoAtual).length
        var mesAvisoSaidasCount = avisoSaidas.filter((el) => el.saidaMesAnoAtual == mesAnoAtual).length
        var mesEmbarcacoesCount = embarcacoes.filter((el) => el.embarcacaoMesAnoAtual == mesAnoAtual).length
        var mesAvisosCount = avisos.filter((el) => el.avisoMesAnoAtual == mesAnoAtual).length
        var mesUsuariosCount = usuarios.filter((el) => el.usuarioMesAnoAtual == mesAnoAtual).length
        var mesTripulantesCount = tripulantes.filter((el) => el.tripulanteMesAnoAtual == mesAnoAtual).length

        for await (formularios of avisoSaidas) {
            totalPass = parseInt(formularios.saidaSomaPassageiros)
            totalPassageiros += totalPass
            if (formularios.saidaMesAnoAtual == mesAnoAtual) {
                passag = parseInt(formularios.saidaSomaPassageiros);
                mesPassageiros += passag;
                documentSaidaMesAnoAtual = formularios.saidaMesAnoAtual

                let embarcacoes = await Embarcacao.find({ _id: formularios.embarcacao }).lean()
                for await (const embs of embarcacoes) {
                    if (bandeirasTotal.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoTotal++
                    } if (bandeirasExt.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoExt++
                    } if (bandeirasBRA.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoBRA++
                    } if (bandeirasBO.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoBO++
                    } if (bandeirasPA.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoPA++
                    } if (bandeirasARG.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoARG++
                    } if (bandeirasURU.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoURU++

                    } if (['empurrador'].includes(embs.embarcacaoTipo) & bandeirasBRA.indexOf(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoInternacionalEmp++
                    } if (['empurrador'].includes(embs.embarcacaoTipo) & bandeirasBRA.includes(embs.embarcacaoBandeira)) {
                        mesEmbarcacaoNacionalEmp++
                    } if (['barcaça'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoBarcaca++
                    } if (['rebocadorEmpurrador'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoRebocadorEmpurador++
                    } if (['balsa'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoBalsa++
                    } if (['cargaGeral'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoCargaGeral++
                    } if (['draga'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoDraga++
                    } if (['lancha'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoLancha++
                    } if (['embarcacaoPassageiros'].includes(embs.embarcacaoTipo)) {
                        mesEmbarcacaoPassageiros++
                    }
                }
            }
        }

        for await (formularios of avisoSaidas) {
            let embarcacoes = await Embarcacao.find({ _id: formularios.embarcacao }).lean()
            for await (const saidaEmbsTotal of embarcacoes) {
                if (bandeirasTotal.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoTotal++
                } if (bandeirasExt.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoExt++
                } if (bandeirasBRA.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoBRA++
                } if (bandeirasBO.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoBO++
                } if (bandeirasPA.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoPA++
                } if (bandeirasARG.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoARG++
                } if (bandeirasURU.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoURU++

                } if (['empurrador'].includes(saidaEmbsTotal.embarcacaoTipo) & bandeirasBRA.indexOf(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoInternacionalEmp++
                } if (['empurrador'].includes(saidaEmbsTotal.embarcacaoTipo) & bandeirasBRA.includes(saidaEmbsTotal.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoNacionalEmp++
                } if (['barcaça'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoBarcaca++
                } if (['rebocadorEmpurrador'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoRebocadorEmpurador++
                } if (['balsa'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoBalsa++
                } if (['cargaGeral'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoCargaGeral++
                } if (['draga'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoDraga++
                } if (['lancha'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoLancha++
                } if (['embarcacaoPassageiros'].includes(saidaEmbsTotal.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoPassageiros++
                }
            }
        }

        for await (const embsTotal of embarcacoes) {
            if (bandeirasTotal.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoTotal++
            } if (bandeirasExt.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoExt++
            } if (bandeirasBRA.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoBRA++
            } if (bandeirasBO.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoBO++
            } if (bandeirasPA.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoPA++
            } if (bandeirasARG.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoARG++
            } if (bandeirasURU.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoURU++

            } if (['empurrador'].includes(embsTotal.embarcacaoTipo) & bandeirasBRA.indexOf(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoInternacionalEmp++
            } if (['empurrador'].includes(embsTotal.embarcacaoTipo) & bandeirasBRA.includes(embsTotal.embarcacaoBandeira)) {
                totalEmbarcacaoNacionalEmp++
            } if (['barcaça'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoBarcaca++
            } if (['rebocadorEmpurrador'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoRebocadorEmpurador++
            } if (['balsa'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoBalsa++
            } if (['cargaGeral'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoCargaGeral++
            } if (['draga'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoDraga++
            } if (['lancha'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoLancha++
            } if (['embarcacaoPassageiros'].includes(embsTotal.embarcacaoTipo)) {
                totalEmbarcacaoPassageiros++
            }
        }

        const html = `<h1>Relatório do Ultimo mês</h1><br>
                            <table border="10">
                            <br>
                                <caption>Relatório Mês ${mesAtualString}</caption>
                                <thead>
                                    <tr>
                                        <th>Saídas de Embarcações Estrangeiras</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Empurrador:</td>
                                        <td>${mesEmbarcacaoInternacionalEmp}</td>
                                    </tr>
                                    <tr>
                                        <td>Barcaças:</td>
                                        <td>${mesEmbarcacaoBarcaca}</td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td>${mesEmbarcacaoInternacionalEmp + mesEmbarcacaoBarcaca}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                <tr>
                                    <th>Saídas de Embarcações Nacionais</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Rebocado/Empurrador</td>
                                        <td>${mesEmbarcacaoRebocadorEmpurador}</td>
                                    </tr>
                                    <tr>
                                        <td>Balsa</td>
                                        <td>${mesEmbarcacaoBalsa}</td>
                                    </tr>
                                    <tr>
                                        <td>Carga Geral</td>
                                        <td>${mesEmbarcacaoCargaGeral}</td>
                                    </tr>
                                    <tr>
                                        <td>Draga</td>
                                        <td>${mesEmbarcacaoDraga}</td>
                                    </tr>
                                    <tr>
                                        <td>Empurrador</td>
                                        <td>${mesEmbarcacaoNacionalEmp}</td>
                                    </tr>
                                    <tr>
                                        <td>Lancha</td>
                                        <td>${mesEmbarcacaoLancha}</td>
                                    </tr>
                                    <tr>
                                        <td>Embarcação de passageiros</td>
                                        <td>${mesEmbarcacaoPassageiros}</td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td>${mesEmbarcacaoNacionalEmp + mesEmbarcacaoRebocadorEmpurador + mesEmbarcacaoBalsa + mesEmbarcacaoCargaGeral + mesEmbarcacaoDraga + mesEmbarcacaoLancha + mesEmbarcacaoPassageiros}</td>
                                    </tr>
                                    <tr>
                                        <td>N° de passageiros</td>
                                        <td>${mesPassageiros}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br>
                            <br>
    
    
    
    
                            <table>
                            <caption>Relatório Geral</caption>
                            <thead>
                            <tr>
                                <th>Saídas de Embarcações Estrangeiras</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Empurrador:</td>
                                <td>${saidaTotalEmbarcacaoInternacionalEmp}</td>
                            </tr>
                            <tr>
                                <td>Barcaças:</td>
                                <td>${saidaTotalEmbarcacaoBarcaca}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>${saidaTotalEmbarcacaoInternacionalEmp + saidaTotalEmbarcacaoBarcaca}</td>
                            </tr>
                        </tbody>
                        <thead>
                        <tr>
                            <th>Saídas de Embarcações Nacionais</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rebocado/Empurrador</td>
                                <td>${saidaTotalEmbarcacaoRebocadorEmpurador}</td>
                            </tr>
                            <tr>
                                <td>Balsa</td>
                                <td>${saidaTotalEmbarcacaoBalsa}</td>
                            </tr>
                            <tr>
                                <td>Carga Geral</td>
                                <td>${saidaTotalEmbarcacaoCargaGeral}</td>
                            </tr>
                            <tr>
                                <td>Draga</td>
                                <td>${saidaTotalEmbarcacaoDraga}</td>
                            </tr>
                            <tr>
                                <td>Empurrador</td>
                                <td>${saidaTotalEmbarcacaoNacionalEmp}</td>
                            </tr>
                            <tr>
                                <td>Lancha</td>
                                <td>${saidaTotalEmbarcacaoLancha}</td>
                            </tr>
                            <tr>
                                <td>Embarcação de passageiros</td>
                                <td>${saidaTotalEmbarcacaoPassageiros}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>${saidaTotalEmbarcacaoNacionalEmp + saidaTotalEmbarcacaoRebocadorEmpurador + saidaTotalEmbarcacaoBalsa + saidaTotalEmbarcacaoCargaGeral + saidaTotalEmbarcacaoDraga + saidaTotalEmbarcacaoLancha + saidaTotalEmbarcacaoPassageiros}</td>
                            </tr>
                            <tr>
                                <td>N° de passageiros</td>
                                <td>${totalPassageiros}</td>
                            </tr>
                        </tbody>
    
                        </table>
    
    
    
                        <br>
                        <br>
                        <br>
    
    
    
                            <br>
                            <table>
                                <thead>
                                <tr>
                                    <th>Quantidade de Embarcações Estrangeiras</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Empurrador:</td>
                                    <td>${totalEmbarcacaoInternacionalEmp}</td>
                                </tr>
                                <tr>
                                    <td>Barcaças:</td>
                                    <td>${totalEmbarcacaoBarcaca}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>${totalEmbarcacaoInternacionalEmp + totalEmbarcacaoBarcaca}</td>
                                </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>Quantidade de Embarcações Nacionais</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Rebocado/Empurrador</td>
                                    <td>${totalEmbarcacaoRebocadorEmpurador}</td>
                                </tr>
                                <tr>
                                    <td>Balsa</td>
                                    <td>${totalEmbarcacaoBalsa}</td>
                                </tr>
                                <tr>
                                    <td>Carga Geral</td>
                                    <td>${totalEmbarcacaoCargaGeral}</td>
                                </tr>
                                <tr>
                                    <td>Draga</td>
                                    <td>${totalEmbarcacaoDraga}</td>
                                </tr>
                                <tr>
                                    <td>Empurrador</td>
                                    <td>${totalEmbarcacaoNacionalEmp}</td>
                                </tr>
                                <tr>
                                    <td>Lancha</td>
                                    <td>${totalEmbarcacaoLancha}</td>
                                </tr>
                                <tr>
                                    <td>Embarcação de passageiros</td>
                                    <td>${totalEmbarcacaoPassageiros}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>${embarcacoesCount}</td>
                                </tr>
                                </tbody>
                            <thead>
                                <tr>
                                    <th>Informações Gerais</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>N° de passageiros</td>
                                    <td>${totalPassageiros}</td>
                                </tr>
                                <tr>
                                    <td>Despachos</td>
                                    <td>${despachosCount}</td>
                                </tr>
                                <tr>
                                    <td>Avisos de Entrada</td>
                                    <td>${avisoEntradasCount}</td>
                                </tr>
                                <tr>
                                    <td>Avisos de Saída</td>
                                    <td>${avisoSaidasCount}</td>
                                </tr> 
                                <tr>
                                    <td>Embarcações</td>
                                    <td>${embarcacoesCount}</td>
                                </tr> 
                                <tr>
                                    <td>Avisos</td>
                                    <td>${avisosCount}</td>
                                </tr>
                                <tr>
                                    <td>Usuários</td>
                                    <td>${usuariosCount}</td>
                                </tr>
                                <tr>
                                    <td>Tripulantes</td>
                                    <td>${tripulantesCount}</td>
                                </tr>                                                                                                                                                                                                                            
                            </tbody>
                            </table>
                            `

        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err);
            res.attachment(`Relatorio.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        })

        const novoRelatorio = {
            usuarioID: req.user_id,
            mesEmbarcacaoInternacionalEmp: mesEmbarcacaoInternacionalEmp,
            mesEmbarcacaoBarcaca: mesEmbarcacaoBarcaca,
            totalExtrangeiro: mesEmbarcacaoInternacionalEmp + mesEmbarcacaoBarcaca,
            mesEmbarcacaoRebocadorEmpurador: mesEmbarcacaoRebocadorEmpurador,
            mesEmbarcacaoBalsa: mesEmbarcacaoBalsa,
            mesEmbarcacaoCargaGeral: mesEmbarcacaoCargaGeral,
            mesEmbarcacaoDraga: mesEmbarcacaoDraga,
            mesEmbarcacaoNacionalEmp: mesEmbarcacaoNacionalEmp,
            mesEmbarcacaoLancha: mesEmbarcacaoLancha,
            mesEmbarcacaoPassageiros: mesEmbarcacaoPassageiros,
            totalNacional: mesEmbarcacaoRebocadorEmpurador + mesEmbarcacaoBalsa + mesEmbarcacaoCargaGeral + mesEmbarcacaoDraga + mesEmbarcacaoNacionalEmp + mesEmbarcacaoLancha + mesEmbarcacaoPassageiros,
            mesPassageiros: mesPassageiros,
            mesAnoAtual: mesAnoAtual,
            mesAtualString: mesAtualString,
            relatorioDataNumber: Date.now(),
            relatorioDataString: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            mesDespachosCount: mesDespachosCount,
            mesAvisoEntradasCount: mesAvisoEntradasCount,
            mesAvisoSaidasCount: mesAvisoSaidasCount,
            mesEmbarcacoesCount: mesEmbarcacoesCount,
            mesAvisosCount: mesAvisosCount,
            mesUsuariosCount: mesUsuariosCount
        }


        const relatorios = await Relatorio.find().lean();
        if (relatorios.length === 0) {
            await Relatorio(novoRelatorio).save();
        } else {
            const relatorioExistente = relatorios.some((relatorio) => relatorio.mesAnoAtual === novoRelatorio.mesAnoAtual);
            if (relatorioExistente) {
                await Relatorio.replaceOne({ mesAnoAtual: novoRelatorio.mesAnoAtual }, novoRelatorio);
            } else {
                await Relatorio(novoRelatorio).save()
            }
        }

    } catch (err) {
        req.flash('error_msg', 'Erro interno ao gerar relatório')
        res.redirect('/admin/painel')
    }
})


//----     Rota para lista de Relatórios      ----//


router.get('/admin/relatorios', Admin, async (req, res) => {
    try{
        const relatorios = await Relatorio.find().lean().sort({mesAtual: 'asc'})
            res.render('admin/relatorios/relatorios', 
                {relatorios: relatorios
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao gerar relatório')
        res.redirect('/admin/painel')
    }
})


//----    Rota para visualização de Relatório      ----//


router.get('/admin/relatorios/:id', Admin, async (req, res) => {
    try{
        const relatorios = await Relatorio.findOne({_id: req.params.id}).lean()
            res.render('admin/relatorios/relatoriosVizu', 
                {relatorios: relatorios
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao gerar relatório')
        res.redirect('/admin/painel')
    }
})


module.exports = router