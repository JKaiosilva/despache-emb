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

            somaEmbarcacaoTotal = 0
            somaEmbarcacaoExt = 0
            somaEmbarcacaoBRA = 0
            somaEmbarcacaoBO = 0
            somaEmbarcacaoPA = 0
            somaEmbarcacaoARG = 0
            somaEmbarcacaoURU = 0 

            somaEmbarcacaoInternacionalEmp = 0
            somaEmbarcacaoNacionalEmp = 0
            somaEmbarcacaoBarcaca = 0
            somaEmbarcacaoRebocadorEmpurador = 0
            somaEmbarcacaoBalsa = 0
            somaEmbarcacaoCargaGeral = 0
            somaEmbarcacaoDraga = 0
            somaEmbarcacaoLancha = 0
            somaEmbarcacaoPassageiros = 0
            somaPassageiros = 0

            documentSaidaMesAtual = 0



            var despachosCountMes = despachos.filter((el) => el.depachoMesAtual == mesAtual).length
            var avisoEntradasCountMes = avisoEntradas.filter((el) => el.entradaMesAtual == mesAtual).length
            var avisoSaidasCountCount = avisoSaidas.filter((el) => el.saidaMesAtual == mesAtual).length
            var embarcacoesCountMes = embarcacoes.filter((el) => el.embarcacaoMesAtual == mesAtual).length
            var avisosCountMes = avisos.filter((el) => el.avisoMesAtual == mesAtual).length
            var usuariosCountMes = usuarios.filter((el) => el.usuarioMesAtual == mesAtual).length

                for await(const formularios of avisoSaidas){
                    if (formularios.saidaMesAtual == mesAtual) {
                        passag = parseInt(formularios.saidaSomaPassageiros);
                        somaPassageiros += passag;
                        documentSaidaMesAtual = formularios.saidaMesAtual

                        const embarcacoes = await Embarcacao.find({_id: formularios.embarcacao}).lean()
                         for await(const embs of embarcacoes){
                            if(bandeirasTotal.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoTotal++
                            }if(bandeirasExt.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoExt++
                            }if(bandeirasBRA.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoBRA++
                            }if(bandeirasBO.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoBO++
                            }if(bandeirasPA.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoPA++
                            }if(bandeirasARG.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoARG++
                            }if(bandeirasURU.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoURU++

                            }if(['empurrador'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoInternacionalEmp++
                            }if(['empurrador'].includes(embs.embarcacaoTipo) & bandeirasBRA.includes(embs.embarcacaoBandeira)){
                                somaEmbarcacaoNacionalEmp++
                            }if(['barcaça'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoBarcaca++
                            }if(['rebocadorEmpurrador'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoRebocadorEmpurador++
                            }if(['balsa'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoBalsa++
                            }if(['cargaGeral'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoCargaGeral++
                            }if(['draga'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoDraga++
                            }if(['lancha'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoLancha++
                            }if(['embarcacaoPassageiros'].includes(embs.embarcacaoTipo)){
                                somaEmbarcacaoPassageiros++
                            }
                    }}}




                const html = `<h1>Relatório do Ultimo mês</h1><br>
                        <table border="1">
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
                                    <th>Embarcações Estrangeiras</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Empurrador:</td>
                                    <td>${somaEmbarcacaoInternacionalEmp}</td>
                                </tr>
                                <tr>
                                    <td>Barcaças:</td>
                                    <td>${somaEmbarcacaoBarcaca}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>${somaEmbarcacaoInternacionalEmp + somaEmbarcacaoBarcaca}</td>
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
                                    <td>${somaEmbarcacaoRebocadorEmpurador}</td>
                                </tr>
                                <tr>
                                    <td>Balsa</td>
                                    <td>${somaEmbarcacaoBalsa}</td>
                                </tr>
                                <tr>
                                    <td>Carga Geral</td>
                                    <td>${somaEmbarcacaoCargaGeral}</td>
                                </tr>
                                <tr>
                                    <td>Draga</td>
                                    <td>${somaEmbarcacaoDraga}</td>
                                </tr>
                                <tr>
                                    <td>Empurrador</td>
                                    <td>${somaEmbarcacaoNacionalEmp}</td>
                                </tr>
                                <tr>
                                    <td>Lancha</td>
                                    <td>${somaEmbarcacaoLancha}</td>
                                </tr>
                                <tr>
                                    <td>Embarcação de passageiros</td>
                                    <td>${somaEmbarcacaoPassageiros}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>${somaEmbarcacaoNacionalEmp + somaEmbarcacaoRebocadorEmpurador + somaEmbarcacaoBalsa + somaEmbarcacaoCargaGeral + somaEmbarcacaoDraga + somaEmbarcacaoLancha + somaEmbarcacaoPassageiros}</td>
                                </tr>
                                <tr>
                                    <td>N° de passageiros</td>
                                    <td>${somaPassageiros}</td>
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
            somaEmbarcacaoInternacionalEmp: somaEmbarcacaoInternacionalEmp,
            somaEmbarcacaoBarcaca: somaEmbarcacaoBarcaca,
            totalExtrangeiro: somaEmbarcacaoInternacionalEmp + somaEmbarcacaoBarcaca,
            somaEmbarcacaoRebocadorEmpurador: somaEmbarcacaoRebocadorEmpurador,
            somaEmbarcacaoBalsa: somaEmbarcacaoBalsa,
            somaEmbarcacaoCargaGeral: somaEmbarcacaoCargaGeral,
            somaEmbarcacaoDraga: somaEmbarcacaoDraga,
            somaEmbarcacaoNacionalEmp: somaEmbarcacaoNacionalEmp,
            somaEmbarcacaoLancha: somaEmbarcacaoLancha,
            somaEmbarcacaoPassageiros: somaEmbarcacaoPassageiros,
            totalNacional: somaEmbarcacaoRebocadorEmpurador + somaEmbarcacaoBalsa + somaEmbarcacaoCargaGeral + somaEmbarcacaoDraga + somaEmbarcacaoNacionalEmp + somaEmbarcacaoLancha + somaEmbarcacaoPassageiros,
            somaPassageiros: somaPassageiros,
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