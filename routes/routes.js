const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { userInfo } = require('os')
require('../models/Usuario')
const {eUser} = require('../helpers/eUser')
const moment = require('moment')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')
require('../models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')
require('../models/AvisoSaida')
const AvisoSaida = mongoose.model('avisoSaidas')
require('../models/Embarcacao')
const Embarcacao = mongoose.model('embarcacoes')

// Novo Formulário

        router.get('/formulario', eUser, (req, res) => {
            Embarcacao.find({usuarioID: req.user._id}).lean().sort({embarcacaoDataCadastro: 'asc'}).then((embarcacoes) => {
                Despacho.find({usuarioID: req.user._id}).lean().sort({despachoDataPedido: 'asc'}).then((despachos) => {
                    AvisoEntrada.find({usuarioID: req.user._id}).lean().sort({entradaDataPedido: 'desc'}).then((avisoEntradas) => {
                        AvisoSaida.find({usuarioID: req.user._id}).lean().sort({saidaDataPedido: 'asc'}).then((avisoSaidas) => {
                            res.render('formulario/preform', {despachos: despachos, avisoEntradas: avisoEntradas, avisoSaidas: avisoSaidas, embarcacoes: embarcacoes})
                        })
                    })
                })
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Não foi possivel mostrar os formularios')
                res.redirect('/')
            })
           
        })

        router.get('/sobrenos', (req, res) => {
            res.render('pages/sobrenos')
        })

        router.get('/termosUso', (req, res) => {
            res.render('pages/termosUso')
        })

        router.get('/avisoSaida', eUser, (req, res) => {
            Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
                res.render('formulario/avisoSaida', {embarcacoes: embarcacoes})
            }).catch((err) => {
                req.flash('error_msg', 'Erro interno ao mostrar formulario')
                res.redirect('formulario/preform')
            })
        })

        router.get('/avisoEntrada', eUser, (req, res) => {
            Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) =>{
                res.render('formulario/avisoEntrada', {embarcacoes: embarcacoes})
            }).catch((err) => {
                req.flash('error_msg', 'Erro interno ao mostrar formulario')
                res.redirect('formulario/preform')
            })
        })

        router.get('/despacho', eUser, (req, res) => {
            Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
                res.render('formulario/despacho', {embarcacoes: embarcacoes})
            }).catch((err) => {
                req.flash('error_msg', 'Erro interno ao mostrar formulario')
                res.redirect('formulario/preform')
            })
        })


        router.post('/formulario/addEmbarcacao', (req, res) => {
            const novaEmbarcacao = {
                usuarioID: req.user._id,
                embarcacaoNome: req.body.embarcacaoNome,
                embarcacaoTipo: req.body.embarcacaoTipo,
                embarcacaoBandeira: req.body.embarcacaoBandeira,
                embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
                embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
                embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
                embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
                embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
                embarcacaoArmador: req.body.embarcacaoArmador,
                embarcacaoNCRA: req.body.embarcacaoNCRA,
                embarcacaoValidade: req.body.embarcacaoValidade,
                embarcacaoDataCadastro: moment(Date.now()).format('DD/MM/YYYY HH:mm')
            }
            new Embarcacao(novaEmbarcacao).save().then(() => {
                req.flash('success_msg', 'Embarcação cadastrada com sucesso')
                res.redirect('/')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao salvar embarcação')
                res.redirect('/')
            })
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
                embarcacao: req.body.embarcacao,

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

        router.post('/formulario/avisoEntrada', eUser, (req, res) => {
            const novoAvisoEntrada = {
                usuarioID: req.user._id,
                entradaNprocesso: req.body.entradaNprocesso,
                entradaPortoChegada: req.body.entradaPortoChegada,
                entradaDataHoraChegada: req.body.entradaDataHoraChegada,
                entradaPosicaoPortoAtual: req.body.entradaPosicaoPortoAtual,
                entradaPortoOrigem: req.body.entradaPortoOrigem,
                entradaPortoDestino: req.body.entradaPortoDestino,
                entradaDataHoraEstimadaSaida: req.body.entradaDataHoraEstimadaSaida,
                entradaNomeEmbarcacao: req.body.entradaNomeEmbarcacao,
                entradaTipoEmbarcacao: req.body.entradaTipoEmbarcacao,
                entradaBandeira: req.body.entradaBandeira,
                entradaNInscricaoAutoridadeMaritima: req.body.entradaNInscricaoAutoridadeMaritima,
                entradaArqueacaoBruta: req.body.entradaArqueacaoBruta,
                entradaTonelagemPorteBruto: req.body.entradaTonelagemPorteBruto,
                entradaNomeRepresentanteEmbarcacao: req.body.entradaNomeRepresentanteEmbarcacao,
                entradaCPFCNPJRepresentanteEmbarcacao: req.body.entradaCPFCNPJRepresentanteEmbarcacao,
                entradaTelefoneRepresentanteEmbarcacao: req.body.entradaTelefoneRepresentanteEmbarcacao,
                entradaEnderecoRepresentanteEmbarcacao: req.body.entradaEnderecoRepresentanteEmbarcacao,
                entradaEmailRepresentanteEmbarcacao: req.body.entradaEmailRepresentanteEmbarcacao,
                entradaDadosUltimaInpecaoNaval: req.body.entradaDadosUltimaInpecaoNaval,
                entradaDeficienciasRetificadasPorto: req.body.entradaDeficienciasRetificadasPorto,
                entradaTransporteCagaPerigosa: req.body.entradaTransporteCagaPerigosa,
                entradaObservacoes: req.body.entradaObservacoes,
                entradaTripulantes: "Nome: "+ req.body.entradaTripulantesNome+" || Grau ou Função"+
                req.body.entradaTripulantesGrauFuncao + " || Data de Nascimento: "+
                req.body.entradaTripulantesDataNascimento + " || Numero da CIR: "+
                req.body.entradaTipulantesNCIR + " || Validade da CIR: "+
                req.body.entradaTripulantesValidadeCIR,
                entradaPassageiros: "Nome: "+ req.body.entradaPassageirosNome+
                " || Data de Nascimento: " + req.body.entradaPassageirosDataNascimento+
                " || Sexo: " + req.body.entradaPassageirosSexo,
                entradaComboios: "Nome: "+ req.body.entradaComboiosNome+
                " || Numero de Inscrição: "+ req.body.entradaComboiosNIncricao+
                " || Arqueação Bruta: "+ req.body.entradaComboiosArqueacaoBruta+
                " || Carga: "+ req.body.entradaComboiosCarga+
                " || Quantidade da Caga: "+ req.body.entradaComboiosQuantidadeCarga,
                entradaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
                embarcacao: req.body.embarcacao,

            }
            new AvisoEntrada(novoAvisoEntrada).save().then(() => {
                req.flash('success_msg', 'Aviso de entrada enviado com sucesso')
                res.redirect('/')
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Erro interno, tente novamente')
                res.redirect('/')
            })
        })

        router.post('/formulario/avisoSaida', (req, res) => {
            const novoAvisoSaida = {
                usuarioID: req.user._id,
                saidaNprocesso: req.body.saidaNprocesso,
                saidaPortoSaida: req.body.saidaPortoSaida,
                saidaDataHoraSaida: req.body.saidaDataHoraSaida,
                saidaPortoDestino: req.body.saidaPortoDestino,
                saidaDataHoraChegada: req.body.saidaDataHoraChegada,
                saidaNomeEmbarcacao: req.body.saidaNomeEmbarcacao,
                saidaTipoEmbarcacao: req.body.saidaTipoEmbarcacao,
                saidaBandeira: req.body.saidaBandeira,
                saidaNInscricaoAutoridadeMaritima: req.body.saidaNInscricaoAutoridadeMaritima,
                saidaArqueacaoBruta: req.body.saidaArqueacaoBruta,
                saidaTonelagemPorteBruto: req.body.saidaTonelagemPorteBruto,
                saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
                saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
                saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
                saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
                saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
                saidaObservacoes: req.body.saidaObservacoes,
                saidaTripulantes: "Nome: "+ req.body.saidaTripulantesNome+" || Grau ou Função"+
                req.body.saidaTripulantesGrauFuncao + " || Data de Nascimento: "+
                req.body.saidaTripulantesDataNascimento + " || Numero da CIR: "+
                req.body.saidaTipulantesNCIR + " || Validade da CIR: "+
                req.body.saidaTripulantesValidadeCIR,
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

            }
            new AvisoSaida(novoAvisoSaida).save().then(() => {
                req.flash('success_msg', 'Aviso de saida enviado com sucesso')
                res.redirect('/')
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Erro interno, tente novamente')
                res.redirect('/')
            })
        })


        router.get('/addEmbarcacao', (req, res) => {
            res.render('formulario/addEmbarcacao')
        })

        router.get('/addTripulante', (req, res) => {
            res.render('formulario/addTripulante')
        })


        router.get('/formulario/embarcacaoVizu/:id', (req, res) => {
            Embarcacao.findOne({_id: req.params.id}).lean().then((embarcacoes) => {
                Despacho.find({embarcacao: embarcacoes._id}).lean().then((despachos) => {
                    AvisoEntrada.find({embarcacao: embarcacoes._id}).lean().then((avisoEntradas) => {
                        AvisoSaida.find({embarcacao: embarcacoes._id}).lean().then((avisoSaidas) => {
                            res.render('formulario/embarcacaoVizu', {embarcacoes: embarcacoes, despachos: despachos, avisoEntradas: avisoEntradas, avisoSaidas: avisoSaidas})
                        })
                    })
                })
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Erro ao mostrar Embarcação')
                res.redirect('/')
            })
        })

        router.get('/formulario/despachoVizu/:id', (req, res) => {
            Despacho.findOne({_id: req.params.id}).lean().then((despachos) => {   
                Embarcacao.findOne({_id: despachos.embarcacao}).lean().then((embarcacoes) => {
                    res.render('formulario/despachoVizu', {despachos: despachos, embarcacoes: embarcacoes})
                })                 
            }).catch((err) => {
                console.log(err)
                res.redirect('/')
            })
        })

        router.get('/formulario/avisoEntradaVizu/:id', (req, res) => {
            AvisoEntrada.findOne({_id: req.params.id}).lean().then((avisoEntradas) => {  
                Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean().then((embarcacoes) => {
                    res.render('formulario/avisoEntradaVizu', {avisoEntradas: avisoEntradas, embarcacoes: embarcacoes})
                })                  
            }).catch((err) => {
                console.log(err)
                res.redirect('/')
            })
        })

        router.get('/formulario/avisoSaidaVizu/:id', (req, res) => {
            AvisoSaida.findOne({_id: req.params.id}).lean().then((avisoSaidas) => {
                Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean().then((embarcacoes) => {
                    res.render('formulario/avisoSaidaVizu', {avisoSaidas: avisoSaidas, embarcacoes: embarcacoes})
                })                  
            }).catch((err) => {
                console.log(err)
                res.redirect('/')
            })
        })




module.exports = router

