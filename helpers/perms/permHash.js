require('dotenv');
const bcrypt = require('bcryptjs');


function eAdmin (req, res, next) {
    if(req.user){
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
    }else{
        res.redirect('/')

    }
}


function eOficial(req, res, next) {
    if(req.user){
        const oficialKey = process.env.OFICIAL_KEY;
        const permisao = req.user.perm || null
        
        bcrypt.compare(oficialKey, permisao, (erro, batem) =>{
            if(batem){
                return next()
            }else{
                eAdmin(req, res, next)
            }
        })
    }else{
        res.redirect('/')

    }
}


function eOperador(req, res, next) {
    if(req.user){
        const operadorKey = process.env.OPERADOR_KEY;
        const permisao = req.user.perm || null
        
        bcrypt.compare(operadorKey, permisao, (erro, batem) =>{
            if(batem){
                return next()
            }else{
                eOficial(req, res, next)
            }
        
        })
    }else{
        res.redirect('/')

    }
}


function eAgencia(req, res, next) {
    if(req.user){
        const agenciaKey = process.env.AGENCIA_KEY;
        const permisao = req.user.perm || null
        
        bcrypt.compare(agenciaKey, permisao, (erro, batem) =>{
            if(batem){
                return next()
            }else{
                eOperador(req, res, next)
            }
        
        })
    }else{
        res.redirect('/');

    }
}


async function eDespachante(req, res, next) {
    try{
        if(req.user){
            const despachanteKey = process.env.DESPACHANTE_KEY;
            const permisao = req.user.perm || null
            
            bcrypt.compare(despachanteKey, permisao, (erro, batem) =>{
                if(batem){
                    return next()
                }else{
                    eAgencia(req, res, next)
                }
            })
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = { eAdmin, eOficial, eOperador, eAgencia, eDespachante}