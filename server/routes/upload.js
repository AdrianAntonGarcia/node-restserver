const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

/**
 * Cuando ejecutemos esta función, todas los archivos que carguemos caen sobre
 * req.files
 */
app.use(fileUpload());



app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }


    /**
     * archivo: el nombre que le vamos a poner cuando pongamos un input
     */
    let archivo = req.files.archivo;

    /**
     * Extensiones permitidas
     */

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1].toLocaleLowerCase();
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permititdas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    /**
     * Hay que hacerlo único y poner algo al final para
     * prevenir el caché del navegador web
     */

    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aqui, imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            //Si hay error, borramos la imagen que acabamos de subir
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            //Si el usuario no existe, borramos la imagen que acabamos de subir
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //Borramos la imagen anterior
        borraArchivo(usuarioBD.img, 'usuarios');
        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            //Si hay error, borramos la imagen que acabamos de subir
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            //Si el usuario no existe, borramos la imagen que acabamos de subir
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        //Borramos la imagen anterior
        borraArchivo(productoBD.img, 'productos');
        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    //Hay que acceder a la imagen que había antes
    let pathImagenAntigua = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //Si exite
    if (fs.existsSync(pathImagenAntigua)) {
        fs.unlinkSync(pathImagenAntigua);
    }
}
module.exports = app;