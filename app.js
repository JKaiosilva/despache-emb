const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const passport = require('passport');

const db = require('./config/bancodados');
require('./config/auth')(passport)
require('dotenv/config');
require('dotenv').config()

require('./helpers/AddIndex')
require('./helpers/navBar/barAgencia')
require('./helpers/AddIndex')
require('./helpers/navBar/barDespachante')
require('./helpers/navBar/barAdmin')




const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars')
const multer = require('multer')

require('./models/Aviso')
const Aviso = mongoose.model('avisos')

const avisoController = require('./routes/avisoController')
const despachoController = require('./routes/despachoController')
const entradaController = require('./routes/entradaController')
const portoController = require('./routes/portoController')
const saidaController = require('./routes/saidaController')
const serverController = require('./routes/serverController')
const tripulanteController = require('./routes/tripulanteController')
const userController = require('./routes/userController')
const comboioController = require('./routes/comboioController')
const relatorioController = require('./routes/relatorioController')
const correcaoController = require('./routes/correcaoController')
const passeSaidaController = require('./routes/passeSaidaController')
const moment = require('moment');

console.log(moment(Date.now()).toLocaleString("pt-BR"))


// Configurações

    //Configuração CORS


    // Session

    app.use(session({
        secret: process.env.SECRET_KEY,
        resave: true,
        saveUninitialized: false
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    // Midleware
        
        app.use(flash())
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;

            next()
        })

    // Body Parser

        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
      
    // Handlebars

        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        
    // Mongoose

        mongoose.set('strictQuery', true)
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log('Servidor conectado!')
        }).catch((err) => {
            console.log('Erro' + err)
        })

    // Public

        app.use(express.static(path.join(__dirname, 'public')))
        app.use((req, res, next) => {
            next();
        })

    

// Rota
        app.get('/', (req, res) => {
            Aviso.find().limit(5).lean().sort({_id: 'desc'}).then((avisos) => {
                avisos.forEach((aviso) => {
                    aviso.data = aviso.data.toString('base64')
                })
                res.render('index', {avisos: avisos})
            })
        })


        app.use(avisoController)
        app.use(despachoController)
        app.use(entradaController)
        app.use(portoController)
        app.use(saidaController)
        app.use(serverController)
        app.use(tripulanteController)
        app.use(userController)
        app.use(relatorioController)
        app.use(correcaoController)
        app.use(passeSaidaController)


// Conectar com Db
    app.listen(process.env.PORT || 8081) 