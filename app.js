const express = require('express');
const handlebars = require('express-handlebars');
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
const {Admin} = require('./helpers/eAdmin')
const pages = require('./routes/routes')
const Handlebars = require('handlebars')
const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
require('./models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')




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
        Handlebars.registerHelper("ifAdmin", function(user, options) {
            if (user && user.eAdmin) {
              return options.fn(this);
            } else {
              return options.inverse(this);
            }
          });
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
            Aviso.find().lean().sort({data: 'desc'}).then((avisos) => {
                res.render('index', {avisos: avisos})
            })
            
        })


        app.use('/formulario', formulario)
        app.use('/usuarios', usuarios)
        app.use('/aviso', Aviso)
        app.use('/admin', admin)
        app.use('/pages', pages)



// Conectar com Db
    app.listen(process.env.PORT || 8081) 