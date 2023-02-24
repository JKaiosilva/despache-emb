const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { userInfo } = require('os')
require('../models/Formulario')
require('../models/Usuario')
const Formulario = mongoose.model('formularios')
const transporter = require('../config/mail')
const {eUser} = require('../helpers/eUser')
const moment = require('moment')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')

// Novo Formulário

        router.get('/formulario', eUser, (req, res) => {
            Despacho.find({usuarioID: req.user._id}).lean().sort({data: 'desc'}).then((despachos) => {
                res.render('formulario/preform', {despachos: despachos})
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Não foi possivel mostrar os formularios')
                res.redirect('/')
            })
           
        })

        router.get('/novo', (req, res) => {
            res.render('formulario/formulario')
        })

        router.post('/formulario/novo', eUser, (req, res) => {
            var erros = []
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
                erros.push({texto: 'Nome inválido!'})
            }if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
                erros.push({texto: 'Email inválido'})
            }if(!req.body.codigo || typeof req.body.codigo == undefined || req.body.codigo == null){
                erros.push({texto: 'Código inválido'})
            }if(!req.body.dsaida || typeof req.body.dsaida == undefined || req.body.dsaida == null){
                erros.push({texto: 'Data de saída inválida'})
            }if(!req.body.dvolta || typeof req.body.dvolta == undefined || req.body.dvolta == null){
                erros.push({texto: 'Data de volta inválida'})
            }if(req.body.nome < 4){
                erros.push({texto: 'Nome muito curto'})
            }if(erros.length > 0){
                console.log(erros)
                res.render('/', {erros: erros})
            }else{
                
                const novoFormulario = {
                    nome: req.body.nome,
                    codigo: req.body.codigo,
                    email: req.body.email,
                    dsaida: req.body.dsaida,
                    dvolta: req.body.dvolta,
                    data: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
                    idUsuario: req.user._id
                }
                new Formulario(novoFormulario).save().then(() => {
                    
                    req.flash('success_msg', 'Formulário enviado com sucesso')
                    res.redirect('/formulario/novo')
                    transporter.sendMail({
                        from: 'Kaio Silva <crb.app.forms@hotmail.com>',
                        to: 'kaiofer39@gmail.com' + ',' + req.body.email,
                        subject: 'teste integrado',
                        text: 'Segue abaixo as informações inseridas no formulário',
                        html: 'Nome: ' + req.body.nome + '<br>' + 
                        'Email: ' + req.body.email + '<br>' +
                        'codigo: ' + req.body.codigo + '<br>' +
                        'Data de Saída: ' + req.body.dsaida + '<br>' +
                        'Data de Volta: ' + req.body.dvolta + '<br>' +
                        'Data da Solicitação: ' + moment(Date.now()).format('DD/MM/YYYY HH:mm'),
                    }).then((message) => {
                        req.flash('success_msg', 'Formulário enviado com sucesso')
                        console.log(message)
                    }).catch((err) => {
                        console.log(err)
                        req.flash('error_msg', 'Houve um erro ao enviar o formulário')
                        res.redirect('/formulario/novo')
                    })
                }).catch((err) => {
                    console.log(err)
                    req.flash('error_msg', 'Houve um erro ao enviar o formulário')
                    res.redirect('/formulario/novo')
                })

            }
        })




        router.get('/sobrenos', (req, res) => {
            res.render('pages/sobrenos')
        })

        router.get('/termosUso', (req, res) => {
            res.render('pages/termosUso')
        })

        router.get('/avisoSaida', eUser, (req, res) => {
            res.render('formulario/avisoSaida')
        })

        router.get('/avisoEntrada', eUser, (req, res) => {
            res.render('formulario/avisoEntrada')
        })

        router.get('/despacho', eUser, (req, res) => {
            res.render('formulario/despacho')
        })


        router.post('/formulario/despacho', (req, res) => {
            const novoDespacho = {
                usuarioID: req.user._id,
                NprocessoDespacho: req.body.NprocessoDespacho,
                despachoPortoEstadia: req.body.despachoPortoEstadia,
                despachoDataHoraPartida: req.body.despachoDataHoraPartida,
                despachoNomeEmbarcação: req.body.despachoNomeEmbarcação,
                despachoTipoEmbarcacao: req.body.despachoTipoEmbarcacao,
                despachoBandeira: req.body.despachoBandeira,
                despachoNInscricaoautoridadeMB: req.body.despachoNInscricaoautoridadeMB,
                despachoArqueacaoBruta: req.body.despachoArqueacaoBruta,
                despachoComprimentoTotal: req.body.despachoComprimentoTotal,
                despachoTonelagemPorteBruto: req.body.despachoTonelagemPorteBruto,
                despachoCertificadoRegistroAmador: req.body.despachoCertificadoRegistroAmador,
                despachoArmador: req.body.despachoArmador,
                despacgoNCRA: req.body.despacgoNCRA,
                despachoValidade: req.body.despachoValidade,
                despachoNomeRepresentanteEmbarcacao: req.body.despachoNomeRepresentanteEmbarcacao,
                despachoCPFCNPJRepresentanteEmbarcacao: req.body.despachoCPFCNPJRepresentanteEmbarcacao,
                despachoTelefoneRepresentanteEmbarcacao: req.body.despachoTelefoneRepresentanteEmbarcacao,
                despachoEnderecoRepresentanteEmbarcacao: req.body.despachoEnderecoRepresentanteEmbarcacao,
                despachoEmailRepresentanteEmbarcacao: req.body.despachoEmailRepresentanteEmbarcacao,
                despachoDataUltimaInspecaoNaval: req.body.despachoDataUltimaInspecaoNaval,
                despachoDeficiencias: req.body.despachoDeficiencias,
                despachoTransportaCargaPerigosa: req.body.despachoTransportaCargaPerigosa,
                despachoCertificadoTemporario90dias: req.body.despachoCertificadoTemporario90dias,
                despachoCasoDocumentoExpirado: req.body.despachoCasoDocumentoExpirado,
                despachoOBS: req.body.despachoOBS,
                despachoNTripulantes: req.body.despachoNTripulantes,
                despachoNomeComandante: req.body.despachoNomeComandante,
                despachoTripulantes:"Nomes: "+ req.body.despachoTripulantesNome+" || Grau ou Função: "+
                req.body.despachoTripulantesGrau+" || Data de nascimento: "+
                req.body.despachoTripulantesDataNascimento+" || N° da CIR: "+
                req.body.despachoTripulantesNCIR+" || Validade da CIR: "+
                req.body.despachoTripulantesValidadeCIR,
                despachoNomeEmbarcacao: req.body.despachoNomeEmbarcacao,
                despachoNEmbN: req.body.despachoNEmbN,
                despachoArqueacaoBrutaComboio: req.body.despachoArqueacaoBrutaComboio,
                despachoCarga: req.body.despachoCarga,
                despachoQuantidadeCaga: req.body.despachoQuantidadeCaga,
                despachoSomaArqueacaoBruta: req.body.despachoSomaArqueacaoBruta,
                despachoDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),

            }
            new Despacho(novoDespacho).save().then(() => {
                req.flash('success_msg', 'Despacho enviado com sucesso')
                res.redirect('/')
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Erro interno, tente novamente')
                res.redirect('/')
            })
        })

        router.get('/formulario/vizu/:id', (req, res) => {
            Despacho.findOne({_id: req.params.id}).lean().then((despachos) => {
                res.render('formulario/vizu', {despachos: despachos})
            }).catch((err) => {
                console.log(err)
                res.redirect('/')
            })
        })

module.exports = router

