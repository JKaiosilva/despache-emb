
module.exports = {
    eOperador: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == 1 
        || req.isAuthenticated() && req.user.oficial == 1 
        || req.isAuthenticated() && req.user.operador == 1 ) 
        {
            return next();
        }
        req.flash('error_msg', 'Você não tem autorização para acessar esta página!')
        res.redirect('/')
    }
}