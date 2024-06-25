const express = require('express');
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')
const path = require('path')

const app = express();

// Middleware para parsear JSON
app.use(myconn(mysql,{
    host: '192.168.1.5',
    port: 3306,
    user: 'root',
    password: 'root_js',
    database: 'images'
}));
app.use(cors())
app.use(express.static(path.join(__dirname, 'dbimages')))

// Importar y usar las rutas
app.use(require('./routes/routes'));

// Iniciar el servidor
app.listen(9000, () => {
    console.log('Servidor corriendo correctamente en', 'http://192.168.1.5:' + 9000);
});
