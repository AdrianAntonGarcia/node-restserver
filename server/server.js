require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// Using Node.js `require()`

const app = express();

const bodyParser = require('body-parser');

//MIDDLEWARES

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Hablitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../server/public')));
console.log(path.resolve(__dirname, '../server/public'));
//Configuración global de rutas

app.use(require('./routes/index'));


//mongoose
//mongodb+srv://adrian:8dT8ukS7O1zwRJbq@cluster0-8vk8z.mongodb.net/cafe
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});