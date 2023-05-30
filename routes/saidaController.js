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

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')

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


router.get('/admin/saidas', Admin, (req, res) => {
    AvisoSaida.find().limit(5).lean().sort({ saidaData: 'desc' }).then((avisoSaidas) => {
        res.render('admin/saidas/saidas', { avisoSaidas: avisoSaidas })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar avisos de saida!')
        res.redirect('/')
    })
})


router.get('/admin/saidasPage/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await AvisoSaida.count()
        if (parseInt(page) * limit >= contagem) {
            nextPage = ''
            hidden = 'hidden'
        } else {
            nextPage = parseInt(page) + 1;
            hidden = ''
        }

        if (parseInt(page) == 2) {
            previousPage = ''
        } else {
            previousPage = parseInt(page) - 1
        }
        const avisoSaidas = await AvisoSaida.find().skip(skip).limit(limit).lean().sort({ saidaData: 'desc' })
        res.render('admin/saidas/saidasPage',
            {
                avisoSaidas: avisoSaidas,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {

    }
})


router.get('/formulario/avisoSaidaVizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const avisoSaidas = await AvisoSaida.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: avisoSaidas.saidaTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean()
        const portos = await Porto.findOne({_id: avisoSaidas.saidaPortoSaida}).lean()

            res.render('formulario/saidas/avisoSaidaVizu',
                {avisoSaidas: avisoSaidas,
                    embarcacoes: embarcacoes,
                        tripulantes: tripulantes,
                            portos: portos,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})



router.get('/formulario/avisoSaida', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()
            res.render('formulario/saidas/avisoSaida',
                {embarcacoes: embarcacoes,
                    tripulantes: tripulantes,
                        portos: portos
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})


router.get('/saidas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try{
        const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
            res.render('formulario/saidas/saidas', 
                {avisoSaidas: avisoSaidas,
                    admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/saidas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await AvisoSaida.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1
            }
            const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({saidaData: 'desc'})
                res.render('formulario/saidas/saidasPage', 
                    {avisoSaidas: avisoSaidas,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden,
                                    admin: admin
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})



router.get('/avisoSaida/:id/pdf', Admin, async (req, res) => {
    try{
        const avisoSaidas = await AvisoSaida.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean()
        const tripulantes = await Tripulante.find({_id: avisoSaidas.saidaTripulantes}).lean()
        const tripulantesInfos = []
        var tripulantesArray = tripulantes.forEach((el) => {
            tripulantesInfos.push(`<br>` + "Nome: " + el.tripulanteNome + " ")
            tripulantesInfos.push("Grau: " + el.tripulanteGrau + " ")
            tripulantesInfos.push("Numero da CIR: " + el.tripulanteNCIR)
            })

    const html = `
    <style>
       
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          
          h4 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          /* estilizando as caixas de texto */
          input[type="text"] {
            display: block;
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          /* estilizando os rótulos */
          label {
            display: block;
            font-size: 16px;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          /* estilizando as divisões */
          div {
            margin-bottom: 20px;
          }
          
          /* estilizando o formulário como um todo */
          form {
            padding: 20px;
            font-family: Arial, sans-serif;
          }

        </style>
    <form>
        <div>
            <label>N° Pocesso de Despacho</label>
            <input type="text" value="${avisoSaidas.saidaNprocesso}" disabled>
        </div>
        <div>
            <h4>Dados da Partida</h4>
            <div>
                <label>Porto de Saída</label>
                <input type="text" value="${avisoSaidas.saidaPortoSaida}" disabled>
                <label>Data/Hora de Saída</label>
                <input type="text" value="${avisoSaidas.saidaDataHoraSaida}" disabled>
            </div>
            <div>
                <label>Porto de Destino</label>
                <input type="text" value="${avisoSaidas.saidaPortoDestino}" disabled>
                <label>Data/Hora Estimada de Chegada</label>
                <input type="text" value="${avisoSaidas.saidaDataHoraChegada}" disabled>
            </div>
            <div>
            <h4>Dados da Embarcação</h4>
                <div>
                    <label>Nome da Embarcação</label>
                    <input type="text" value="${embarcacoes.embarcacaoNome}" disabled>
                    <label>Tipo da Embarcação</label>
                    <input type="text" value="${embarcacoes.embarcacaoTipo}" disabled>
                </div>
                <div>
                    <label>Bandeira</label>
                    <input type="text" value="${embarcacoes.embarcacaoBandeira}" disabled>
                    <label>N° Inscrição na Autoridade Marítima do Brasil</label>
                    <input type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" disabled>
                </div>
                <div>
                    <label>Arqueação Buta</label>
                    <input type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" disabled>
                    <label>Tonelagem Porte Bruto</label>
                    <input type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" disabled>
                </div>
        </div>
            <h4 >Dados do Representante da Embarcação</h4>
            <div>
                <label>Nome</label>
                <input type="text" value="${avisoSaidas.saidaNomeRepresentanteEmbarcacao}" disabled>
            </div>
            <div>
                <label>CPF/CNPJ</label>
                <input type="text" value="${avisoSaidas.saidaCPFCNPJRepresentanteEmbarcacao}" disabled>
                <label>Telefone</label>
                <input type="text" value="${avisoSaidas.saidaTelefoneRepresentanteEmbarcacao}" disabled>
            </div>
            <div>
                <label>Endereço</label>
                <input type="text" value="${avisoSaidas.saidaEnderecoRepresentanteEmbarcacao}" disabled>
                <label>Email</label>
                <input type="text" value="${avisoSaidas.saidaEmailRepresentanteEmbarcacao}" disabled>
            </div>
        </div>
        <div>
            <h4>Observações</h4>
            <div>
                <input type="text" value="${avisoSaidas.saidaObservacoes}" disabled>
            </div>
        </div>
        <div>
            <div>
                <h4>Lista de Tripulantes</h4>
                ${tripulantesInfos}
            </div>
        </div>
        <div>
            <div>
                <h4>Lista de Passageiros</h4>
                <input type="text" value="${avisoSaidas.saidaPassageiros}" disabled>
                </div>
            </div>
            <div>
                <label>Somatório de Passageiros</label>
                <input value="${avisoSaidas.saidaSomaPassageiros}" type="number" disabled>
            </div>
            <div>
            <div>
                <h4>Lista de Comboios</h4>
                <input type="text" value="${avisoSaidas.saidaComboios}" disabled>
            </div>
            </div>
            <div>
                <label>Embarcação</label>
                <input value="${embarcacoes.embarcacaoNome}" disabled>
            </div>
</form>
`       

        pdf.create(html).toStream((err, stream) => {
        if (err) return res.send(err);
        res.attachment(`${avisoSaidas.saidaNprocesso}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      
      });
    }catch(err){
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/') 
    }
})



router.post('/formulario/avisoSaida', eUser, async (req, res) => {
    const cleanString = req.body.despachoTripulantes.replace(/[\n' \[\]]/g, '');
    const tripulantes = cleanString.split(',');
    const avisoSaidaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));
        try{
            const novoAvisoSaida = {
                usuarioID: req.user._id,
                saidaNprocesso: req.body.saidaNprocesso,
                saidaPortoSaida: req.body.saidaPortoSaida,
                saidaDataHoraSaida: req.body.saidaDataHoraSaida,
                saidaPortoDestino: req.body.saidaPortoDestino,
                saidaDataHoraChegada: req.body.saidaDataHoraChegada,
                saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
                saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
                saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
                saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
                saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
                saidaObservacoes: req.body.saidaObservacoes,
                saidaSomaPassageiros: req.body.saidaSomaPassageiros,
                saidaTripulantes: avisoSaidaTripulantes,
                saidaPassageiros: "Nome: "+ req.body.saidaPassageirosNome+
                " || Data de Nascimento: " + req.body.saidaPassageirosDataNascimento+
                " || Sexo: " + req.body.saidaPassageirosSexo,
                saidaComboios: "Nome: "+ req.body.saidaComboiosNome+
                " || Numero de Inscrição: "+ req.body.saidaComboiosNIncricao+
                " || Arqueação Bruta: "+ req.body.saidaComboiosArqueacaoBruta+
                " || Carga: "+ req.body.saidaComboiosCarga+
                " || Quantidade da Caga: "+ req.body.saidaComboiosQuantidadeCarga,
                saidaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
                embarcacao: req.body.embarcacao,
                saidaData: Date.now(),
                saidaMesAnoAtual: moment(Date.now()).format('MM/YYYY')
            }
            new AvisoSaida(novoAvisoSaida).save()
                req.flash('success_msg', 'Aviso de saida enviado com sucesso')
                res.redirect('/')
        }catch(err){
        req.flash('error_msg', 'Erro interno, tente novamente')
        res.redirect('/')
        }
    })

    router.get('/admin/relatorioSaidas', Admin, async (req, res) => {
        try{
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
    
                    for await(formularios of avisoSaidas){
                        totalPass = parseInt(formularios.saidaSomaPassageiros)
                        totalPassageiros += totalPass
                        if (formularios.saidaMesAnoAtual == mesAnoAtual) {
                            passag = parseInt(formularios.saidaSomaPassageiros);
                            mesPassageiros += passag;
                            documentSaidaMesAnoAtual = formularios.saidaMesAnoAtual
    
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
        
                        for await(formularios of avisoSaidas){
                            let embarcacoes = await Embarcacao.find({_id: formularios.embarcacao}).lean()
                                 for await(const saidaEmbsTotal of embarcacoes){
                                    if(bandeirasTotal.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoTotal++
                                    }if(bandeirasExt.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoExt++
                                    }if(bandeirasBRA.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoBRA++
                                    }if(bandeirasBO.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoBO++
                                    }if(bandeirasPA.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoPA++
                                    }if(bandeirasARG.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoARG++
                                    }if(bandeirasURU.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoURU++
        
                                    }if(['empurrador'].includes(saidaEmbsTotal.embarcacaoTipo) & bandeirasBRA.indexOf(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoInternacionalEmp++
                                    }if(['empurrador'].includes(saidaEmbsTotal.embarcacaoTipo) & bandeirasBRA.includes(saidaEmbsTotal.embarcacaoBandeira)){
                                        saidaTotalEmbarcacaoNacionalEmp++
                                    }if(['barcaça'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoBarcaca++
                                    }if(['rebocadorEmpurrador'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoRebocadorEmpurador++
                                    }if(['balsa'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoBalsa++
                                    }if(['cargaGeral'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoCargaGeral++
                                    }if(['draga'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoDraga++
                                    }if(['lancha'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoLancha++
                                    }if(['embarcacaoPassageiros'].includes(saidaEmbsTotal.embarcacaoTipo)){
                                        saidaTotalEmbarcacaoPassageiros++
                                    }
                                }
                            }        
    
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
    
                            }if(['empurrador'].includes(embsTotal.embarcacaoTipo) & bandeirasBRA.indexOf(embsTotal.embarcacaoBandeira)){
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
                if(relatorios.length === 0) {
                    await Relatorio(novoRelatorio).save();
                } else {
                    const relatorioExistente = relatorios.some((relatorio) => relatorio.mesAnoAtual === novoRelatorio.mesAnoAtual);
                       if(relatorioExistente){
                            await Relatorio.replaceOne({ mesAnoAtual: novoRelatorio.mesAnoAtual }, novoRelatorio);
                        }else{
                            await Relatorio(novoRelatorio).save()
                    }
                }
           
        }catch(err){
            req.flash('error_msg', 'Erro interno ao gerar relatório')
            res.redirect('/admin/painel')
        }
    })


module.exports = router