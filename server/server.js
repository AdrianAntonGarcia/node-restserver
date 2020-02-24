require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// Using Node.js `require()`

const app = express();

const bodyParser = require('body-parser');

//MIDDLEWARES

/**
 * Las funciones que ponemos con el use se ejecutan cada vez que se realice una petición
 */
/**
 * bodyparser npm
 * Este middleware nos permite leer parametros con el formato application/x-www-form-urlencoded
 * 
 */
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/**
 * Parte de la web
 * Habilitamos la carpeta public
 * Usamos el path.resolve para gestionar las rutas de una forma más eficiente
 * El __dirname nos da la ruta en la que nos encontramos
 */

app.use(express.static(path.resolve(__dirname, '../server/public')));
console.log(path.resolve(__dirname, '../server/public'));
//Configuración global de rutas

/**
 * Recuperamos los servicios que hemos implementado
 */
app.use(require('./routes/index'));


//mongoose
//mongodb+srv://adrian:8dT8ukS7O1zwRJbq@cluster0-8vk8z.mongodb.net/cafe
/**
 * Conectamos con la base de datos, en el URLDB tenemos la ruta
 * de la base de datos, que será la de integración o producción
 * dependiendo donde hayamos arrancado
 */
console.log(process.env.URLDB);
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

/**
 * 
 */
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});