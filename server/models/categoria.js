const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre de la categoría es necesario'],
        unique: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

let Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;
/**
 * Creando una categoria con un usuario
 */
// let Usuario = require('../models/usuario');
// const usuario = Usuario.findOne({ nombre: 'prueba1' }).exec((err, usuarioDB) => {
//     if (err) {
//         console.log("Error encontrando usuario");
//         return false;
//     }
//     console.log("Usuario recuperado:" + usuarioDB);
//     if (usuarioDB) {
//         const categoria = new Categoria({
//             nombre: 'cat1',
//             usuario: usuarioDB._id
//         });
//         categoria.save((err) => {
//             if ("Error salvando categoría", err) console.log(err);
//         });
//     }
// });