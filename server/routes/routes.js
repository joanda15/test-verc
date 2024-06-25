const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración del almacenamiento de multer
const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-Pies-' + file.originalname);
    }
});

// Validar tipo de archivo (solo imágenes)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Archivo válido
    } else {
        cb(new Error('Tipo de archivo no válido. Solo se permiten archivos JPEG, PNG y GIF.')); // Error si no es válido
    }
};

// Configuración de multer con almacenamiento y filtro de archivos
const fileUpload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
}).single('image');

// Ruta de prueba de conexión a la base de datos
router.get('/test-db', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error en el servidor al conectar a la base de datos.');
        }

        conn.query('SELECT 1 + 1 AS solution', (err, results) => {
            if (err) {
                console.error('Error en la consulta de prueba:', err);
                return res.status(500).send('Error en el servidor al realizar la consulta.');
            }

            res.send(`La solución es: ${results[0].solution}`);
        });
    });
});

// Rutas
router.get('/', (req, res) => {
    res.send('Bienvenido a las imágenes de mis pies');
});

router.post('/images/post', fileUpload, (req, res) => {
    // Validación básica de existencia de archivo
    if (!req.file) {
        return res.status(400).send('No se ha seleccionado ningún archivo.');
    }
    
    // Aquí se debe manejar la conexión a la base de datos correctamente
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error en el servidor al conectar a la base de datos.');
        }

        const type = req.file.mimetype;
        const name = req.file.originalname;
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename));

        // Insertar datos en la base de datos
        conn.query('INSERT INTO image SET ?', { type, name, data }, (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).send('Error en el servidor al insertar en la base de datos.');
            }
            
            res.send('Imagen guardada correctamente.');
        });
    });
});

// Middleware de manejo de errores para multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(500).json({ mensaje: 'Error de Multer', error: err.message });
    } else if (err) {
        res.status(400).json({ mensaje: err.message });
    } else {
        next();
    }
});

// Ruta para obtener todas las imágenes de la base de datos
router.get('/images/get', (req, res) => {

    req.getConnection((err, conn) => {
        if (err) { return res.status(500).send('Error en el servidor al conectar a la base de datos.');
        }

        // Consulta para obtener todas las imágenes
        conn.query('SELECT * FROM image', (err, results) => {
            if (err)return res.status(500).send('Error en el servidor al consultar la base de datos.');

            results.map(img => {
                fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id + '-pies.png'), img.data)
            })
            
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimages/'))
            res.json(imagedir)

        });
    });
});

// Ruta para eliminar las imágenes de la base de datos
router.delete('/images/delete/:id', (req, res) => {

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en el servidor al conectar a la base de datos.');

        // Consulta para eliminar la imagen
        conn.query('DELETE FROM image WHERE id = ?', [req.params.id], (err, results) => {
            if (err) return res.status(500).send('Error en el servidor al eliminar de la base de datos.');
                        
            fs.unlinkSync(path.join(__dirname, '../dbimages/' + req.params.id + '-pies.png'))

            res.send('Archivo eliminado.');
            
        });
    });
});

module.exports = router;
