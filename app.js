const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const postForms = require('./routes/postForms')
const getForms = require('./routes/getForms')
const path = require('path');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const db = require('./config/bancodados');
const usuarios = require('./routes/usuario')
require('./config/auth')(passport)
const admin = require('./routes/admin')
const Admin = require('./helpers/eAdmin')
const pages = require('./routes/postForms')
const Handlebars = require('handlebars')
const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
require('./models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')
const ifAdmin = require('./helpers/barAdmin')
require('dotenv/config');
const multer = require('multer')
require('dotenv').config()
require('./helpers/pagination')
const pdfGerator = require('./routes/pdfGerator')
const docsVizu = require('./routes/docsVizu')




// Configurações


    // Session

    app.use(session({
        secret: 'despacheemb',
        resave: true,
        saveUninitialized: true
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
            Aviso.find().limit(5).lean().sort({data: 'desc'}).then((avisos) => {
                avisos.forEach((aviso) => {
                    aviso.data = aviso.data.toString('base64')
                })
                res.render('index', {avisos: avisos})
            })
        })

        app.use(docsVizu)
        app.use(pdfGerator)
        app.use(getForms)
        app.use(postForms)
        app.use('/usuarios', usuarios)
        app.use('/aviso', Aviso)
        app.use('/admin', admin)
        app.use('/pages', pages)



// Conectar com Db
    app.listen(process.env.PORT || 8081) 