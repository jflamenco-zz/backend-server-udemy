

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;




// ==============================================
// Middleware
// ==============================================

exports.verificaToken = function(req, res, next) {
    
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Acceso no autorizado',
                errors: err
            });
        }
        
        req.usuario = decoded.usuario;
        
        next();

    });

}
