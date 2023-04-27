const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Usuario')
require('../models/Despacho')
require('../models/AvisoEntrada')
require('../models/AvisoSaida')
require('../models/Embarcacao')
require('../models/Aviso')
require('../models/Relatorio')

const Despacho = mongoose.model('despachos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Aviso = mongoose.model('avisos')
const Relatorio = mongoose.model('relatorios')
const Usuario = mongoose.model('usuarios')

const pdf = require('html-pdf')
const transporter = require('../config/sendMail')
const moment = require('moment')



router.get('/admin/relatorioSaidas', async (req, res) => {
    try{
            const despachos = await Despacho.find().lean();
            const avisoEntradas = await AvisoEntrada.find().lean();
            const avisoSaidas = await AvisoSaida.find().lean();
            const embarcacoes = await Embarcacao.find().lean();
            const avisos = await Aviso.find().lean();
            const usuarios = await Usuario.find().lean();
            
            let despachosCount = despachos.length;
            let avisoEntradasCount = avisoEntradas.length;
            let avisoSaidasCount = avisoSaidas.length;
            let embarcacoesCount = embarcacoes.length;
            let avisosCount = avisos.length;
            let usuariosCount = usuarios.length;


            mesAtual = moment(Date.now()).format('MM')
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

            documentSaidaMesAtual = 0


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

            var despachosCountMes = despachos.filter((el) => el.depachoMesAtual == mesAtual).length
            var avisoEntradasCountMes = avisoEntradas.filter((el) => el.entradaMesAtual == mesAtual).length
            var avisoSaidasCountCount = avisoSaidas.filter((el) => el.saidaMesAtual == mesAtual).length
            var embarcacoesCountMes = embarcacoes.filter((el) => el.embarcacaoMesAtual == mesAtual).length
            var avisosCountMes = avisos.filter((el) => el.avisoMesAtual == mesAtual).length
            var usuariosCountMes = usuarios.filter((el) => el.usuarioMesAtual == mesAtual).length

                for await(const formularios of avisoSaidas){
                    totalPass = parseInt(formularios.saidaSomaPassageiros)
                    totalPassageiros += totalPass
                    if (formularios.saidaMesAtual == mesAtual) {
                        passag = parseInt(formularios.saidaSomaPassageiros);
                        mesPassageiros += passag;
                        documentSaidaMesAtual = formularios.saidaMesAtual

                        let embarcacoes = await Embarcacao.find({_id: formularios.embarcacao}).lean()
                         for await(const embs of embarcacoes){
                            if(bandeirasTotal.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoTotal++
                            }if(bandeirasExt.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoExt++
                            }if(bandeirasBRA.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoBRA++
                            }if(bandeirasBO.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoBO++
                            }if(bandeirasPA.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoPA++
                            }if(bandeirasARG.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoARG++
                            }if(bandeirasURU.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoURU++

                            }if(['empurrador'].includes(embs.embarcacaoTipo) & bandeirasBRA.indexOf(embs.embarcacaoBandeira)){
                                mesEmbarcacaoInternacionalEmp++
                            }if(['empurrador'].includes(embs.embarcacaoTipo) & bandeirasBRA.includes(embs.embarcacaoBandeira)){
                                mesEmbarcacaoNacionalEmp++
                            }if(['barcaça'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoBarcaca++
                            }if(['rebocadorEmpurrador'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoRebocadorEmpurador++
                            }if(['balsa'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoBalsa++
                            }if(['cargaGeral'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoCargaGeral++
                            }if(['draga'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoDraga++
                            }if(['lancha'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoLancha++
                            }if(['embarcacaoPassageiros'].includes(embs.embarcacaoTipo)){
                                mesEmbarcacaoPassageiros++
                            }
                    }}}

                    
    
    
                             for await(const embsTotal of embarcacoes){
                                if(bandeirasTotal.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoTotal++
                                }if(bandeirasExt.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoExt++
                                }if(bandeirasBRA.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoBRA++
                                }if(bandeirasBO.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoBO++
                                }if(bandeirasPA.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoPA++
                                }if(bandeirasARG.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoARG++
                                }if(bandeirasURU.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoURU++
    
                                }if(['empurrador'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoInternacionalEmp++
                                }if(['empurrador'].includes(embsTotal.embarcacaoTipo) & bandeirasBRA.includes(embsTotal.embarcacaoBandeira)){
                                    totalEmbarcacaoNacionalEmp++
                                }if(['barcaça'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoBarcaca++
                                }if(['rebocadorEmpurrador'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoRebocadorEmpurador++
                                }if(['balsa'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoBalsa++
                                }if(['cargaGeral'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoCargaGeral++
                                }if(['draga'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoDraga++
                                }if(['lancha'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoLancha++
                                }if(['embarcacaoPassageiros'].includes(embsTotal.embarcacaoTipo)){
                                    totalEmbarcacaoPassageiros++
                                }
                            }




                const html = `<h1>Relatório do Ultimo mês</h1><br>
                        <table border="10">
                        <br>
                        ${despachosCountMes}<br>
                        ${avisoEntradasCountMes}<br>
                        ${avisoSaidasCountCount}<br>
                        ${embarcacoesCountMes}<br>
                        ${avisosCountMes}<br>
                        ${usuariosCountMes}<br>
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
                        <br>
                        <table>
                            <caption>Relatório Geral</caption>
                            <thead>
                            <tr>
                                <th>Embarcações Estrangeiras</th>
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
                            <th>Embarcações Nacionais</th>
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
                            <tr>
                                <td>N° de passageiros</td>
                                <td>${totalPassageiros}</td>
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
            mesAtual: mesAtual,
            mesAtualString: mesAtualString,
            relatorioDataNumber: Date.now(),
            relatorioDataString: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            despachosCountMes: despachosCountMes,
            avisoEntradasCountMes: avisoEntradasCountMes,
            avisoSaidasCountCount: avisoSaidasCountCount,
            embarcacoesCountMes: embarcacoesCountMes,
            avisosCountMes: avisosCountMes,
            usuariosCountMes: usuariosCountMes
        }
        
        if(mesAtual == documentSaidaMesAtual){
            await Relatorio.updateOne(novoRelatorio)
        }else{
            await new Relatorio(novoRelatorio).save()
        }
        
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro interno ao gerar relatório')
        res.redirect('/admin/painel')
    }
})

router.get('/admin/relatorios', async (req, res) => {
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

router.get('/admin/relatorios/:id', async (req, res) => {
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