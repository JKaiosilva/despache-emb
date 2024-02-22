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

const {eOficial, eAdmin, eOperador, eAgencia, eDespachante} = require('../helpers/perms/permHash')


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


router.get('/admin/relatorioSaidas', eOperador, async (req, res) => {
    try {
        const despachos = await Despacho.find().lean();
        const avisoEntradas = await AvisoEntrada.find().lean();
        const avisoSaidas = await AvisoSaida.find().lean();
        const avisos = await Aviso.find().lean();
        const usuarios = await Usuario.find().lean();
        const tripulantes = await Tripulante.find().lean();


        let despachosCount = despachos.length;
        let avisoEntradasCount = avisoEntradas.length;
        let avisoSaidasCount = avisoSaidas.length;
        let avisosCount = avisos.length;
        let usuariosCount = usuarios.length;
        let tripulantesCount = tripulantes.length;

        moment.locale('pt-br');
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

                
               
                    if (bandeirasTotal.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoTotal++
                    } if (bandeirasExt.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoExt++
                    } if (bandeirasBRA.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoBRA++
                    } if (bandeirasBO.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoBO++
                    } if (bandeirasPA.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoPA++
                    } if (bandeirasARG.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoARG++
                    } if (bandeirasURU.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoURU++

                    } if (['empurrador'].includes(formularios.embarcacaoTipo) & bandeirasBRA.indexOf(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoInternacionalEmp++
                    } if (['empurrador'].includes(formularios.embarcacaoTipo) & bandeirasBRA.includes(formularios.embarcacaoBandeira)) {
                        mesEmbarcacaoNacionalEmp++
                    } if (['barcaça'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoBarcaca++
                    } if (['rebocadorEmpurrador'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoRebocadorEmpurador++
                    } if (['balsa'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoBalsa++
                    } if (['cargaGeral'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoCargaGeral++
                    } if (['draga'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoDraga++
                    } if (['lancha'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoLancha++
                    } if (['embarcacaoPassageiros'].includes(formularios.embarcacaoTipo)) {
                        mesEmbarcacaoPassageiros++
                    }
            }
        }

        for await (formularios of avisoSaidas) {
                if (bandeirasTotal.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoTotal++
                } if (bandeirasExt.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoExt++
                } if (bandeirasBRA.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoBRA++
                } if (bandeirasBO.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoBO++
                } if (bandeirasPA.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoPA++
                } if (bandeirasARG.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoARG++
                } if (bandeirasURU.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoURU++

                } if (['empurrador'].includes(formularios.embarcacaoTipo) & bandeirasBRA.indexOf(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoInternacionalEmp++
                } if (['empurrador'].includes(formularios.embarcacaoTipo) & bandeirasBRA.includes(formularios.embarcacaoBandeira)) {
                    saidaTotalEmbarcacaoNacionalEmp++
                } if (['barcaça'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoBarcaca++
                } if (['rebocadorEmpurrador'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoRebocadorEmpurador++
                } if (['balsa'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoBalsa++
                } if (['cargaGeral'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoCargaGeral++
                } if (['draga'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoDraga++
                } if (['lancha'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoLancha++
                } if (['embarcacaoPassageiros'].includes(formularios.embarcacaoTipo)) {
                    saidaTotalEmbarcacaoPassageiros++
                }
        }

        const html = `
        <style>
        *{
            font-size: 1.1em;
            padding-left: 1.8rem
        }
        </style>
        <br>
        <br>
        <br>
        <h1 style="font-size: 1.8em">Controle do Tráfego Aquaviário</h1><br>

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

                                </tbody>
                            </table>
                            <br>
                            <br>
                            <br>
                            <br>                            
                            <br>
                            <br>                            
                            <br>
                            <br>  
                            <br>
                            <br>
                            <br>
                            <br>                            
                            <br>
                            <br>                            
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
                        </tbody>
                        </table>

                            `
/*
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err, console.log(err));
            res.attachment(`Relatorio.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        })
*/
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
        req.flash('success_msg', `Relatório criado com sucesso`)
        res.redirect('/admin/relatorios');
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao gerar Relatório (${err})`)
        res.redirect('/admin/painel')
    }
})


//----     Rota para lista de Relatórios      ----//


router.get('/admin/relatorios', eOperador, async (req, res) => {
    try{
        const relatorios = await Relatorio.find().lean().sort({mesAtual: 'asc'})
            res.render('admin/relatorios/relatorios', 
                {
                    relatorios: relatorios
                })
    }catch(err){
        req.flash('error_msg', `Erro ao gerar Relatório (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para visualização de Relatório      ----//


router.get('/admin/relatorios/:id', eOperador, async (req, res) => {
    try{
        const relatorios = await Relatorio.findOne({_id: req.params.id}).lean()
            res.render('admin/relatorios/relatoriosVizu', 
                {
                    relatorios: relatorios
                })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar este Relatório (${err})`)
        res.redirect('/admin/painel')
    }
})


module.exports = router