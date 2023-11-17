require('dotenv');
const bcrypt = require('bcryptjs');

function verificarOficial(req){
    bcrypt.compare(process.env.OFICIAL_KEY, req.user.perm, (erro, batem) => {
        if(batem) {
            console.log('funcionou')
            return true
        }else {

            return false
        }
    })
}

module.exports = {
    eOficial: function(req, res, next) {

        if(bcrypt.compare(process.env.OFICIAL_KEY, req.user.perm)){
            return next()
        }else{
            res.send('er')
        }
        req.flash('error_msg', 'Você não tem autorização para acessar esta página!')
        res.redirect('/')
    }
}