module.exports = {
    eUser: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eUser == 1) {
            return next();
        }
        req.flash('error_msg', 'Você precisa estar logado para acessar esta página!')
        res.redirect('/')
    }
}