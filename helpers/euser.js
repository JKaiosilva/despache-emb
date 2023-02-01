
module.exports = {
    euser: function(req, res, next) {
        if(req.isAuthenticated() && req.user.euser == 1) {
            return next();
        }
        req.flash('error_msg', 'É preciso estar logado para acessar esta página')
        res.redirect('/')
    }
}