require('dotenv');
const bcrypt = require('bcryptjs');


function eAdmin (req, res, next) {
    const adminKey = process.env.ADMIN_KEY
    const permisao = req.user.perm || null
        bcrypt.compare(adminKey, permisao, (error, batem) => {
            if(batem){
                return next()
            }else{
                req.flash('error_msg', 'Você não tem autorização para acessar esta página!')
                res.redirect('/')
            }
        })
}


function eOficial(req, res, next) {
    const oficialKey = process.env.OFICIAL_KEY;
    const permisao = req.user.perm || null
    
    bcrypt.compare(oficialKey, permisao, (erro, batem) =>{
        if(batem){
            return next()
        }else{
            eAdmin(req, res, next)
        }
    })
}


function eOperador(req, res, next) {
    const operadorKey = process.env.OPERADOR_KEY;
    const permisao = req.user.perm || null
    
    bcrypt.compare(operadorKey, permisao, (erro, batem) =>{
        if(batem){
            return next()
        }else{
            eOficial(req, res, next)
        }
    
    })
}


function eAgencia(req, res, next) {
    const agenciaKey = process.env.AGENCIA_KEY;
    const permisao = req.user.perm || null
    
    bcrypt.compare(agenciaKey, permisao, (erro, batem) =>{
        if(batem){
            return next()
        }else{
            eOficial(req, res, next)
        }
    
    })
}


function eDespachante(req, res, next) {
    const despachanteKey = process.env.DESPACHANTE_KEY;
    const permisao = req.user.perm || null
    
    bcrypt.compare(despachanteKey, permisao, (erro, batem) =>{
        if(batem){
            return next()
        }else{
            eAgencia(req, res, next)
        }
    })
}

module.exports = { eAdmin, eOficial, eOperador, eAgencia, eDespachante}