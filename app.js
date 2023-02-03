const express = require('express');
const handlebars = require('express-handlebars');
const bodyParse = require('body-parser');
const app = express();
const formulario = require('./routes/routes')
const path = require('path');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Formulario');
const Formulario = mongoose.model('formularios');
const passport = require('passport');
const db = require('./config/bancodados');
const usuarios = require('./routes/usuario')
require('./config/auth')(passport)
const admin = require('./routes/admin')
const {eAdmin} = require('./helpers/eAdmin')




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

        mongoose.set('strictQuery', false)
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI).then(() => {
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
            res.render('index')
        })


        app.use('/formulario', formulario)
        app.use('/usuarios', usuarios)
        app.get('/admin', eAdmin, (req, res) => {
            res.render('admin/painel')
        })






// Conectar com Db
    app.listen(process.env.PORT || 8081) 