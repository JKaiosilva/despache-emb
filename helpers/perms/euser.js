module.exports = {
    eUser: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == 1 
        || req.isAuthenticated() && req.user.oficial == 1 
        || req.isAuthenticated() && req.user.operador == 1 
        || req.isAuthenticated() && req.user.eAgencia == 1
        || req.isAuthenticated() && req.user.eUser == 1) 
        {
            return next();
        }
        req.flash('error_msg', 'Você precisa estar logado para acessar esta página!')
        res.redirect('/')
    }
}