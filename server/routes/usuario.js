const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();



app.get('/usuario', function(req, res) {
    // Los parámetros opcionales vienen en el query
    // Si no viene informado lo ponemos a 0 por defecto
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    /**
     * Filtrado de campos que queremos buscar, segundo campo del find
     */
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.count({ estado: true }, (err, conteo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });
        });
    });
});




//Post para crear, put para modificar
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // let body = req.body;

    //Recoge de un objeto las propiedades seleccionadas
    let propiedadesValidas = ['nombre', 'email', 'img', 'role', 'estado'];
    let body = _.pick(req.body, propiedadesValidas);

    //Borrar objetos que no queremos que se puedan modificar

    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

/**
 * Borrado lógico de la base de datos
 */
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    Usuario.findOneAndUpdate({ _id: id }, { estado: false }, { new: true, runValidators: true }, (err, usuarioBorradoLogico) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorradoLogico === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorradoLogico
        });
    });
});

/**
 * Borrado físico de la base de datos
 */
// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (usuarioBorrado === null) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'usuario no encontrado'
//                 }
//             });
//         }
//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     });
// });


module.exports = app;