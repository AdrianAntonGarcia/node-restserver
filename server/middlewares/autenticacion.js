const jwt = require('jsonwebtoken');

/**
 * ==========
 * Verificar Token
 * ==========
 * 
 * El next continúa con la ejecucción del programa, si no llamamos
 * al next no se va a ejecutar la función donde tengamos este middleware
 * El decoded es el payload, que es el usuario que le mandamos en el
 * login al hacer el sign
 */

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

/**
 * Verifica token para imagen
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
/**
 * ==========
 * Verificar Admin role
 * ==========
 * Función que verifica si el usuario que está intentando acceder
 * es admin, si lo es deja pasar, si no manda mensaje de error
 * 
 */

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }
};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};