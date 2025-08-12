const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { uploadCSVBack } = require('./helpers');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Carpeta para archivos temporales

app.use(bodyParser.json());
app.use(cors());

// Middleware para depuración
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// =====================
// RUTAS API
// =====================

app.post('/execute-csv', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se recibió archivo CSV' });
    }
    console.log('Archivo CSV recibido:', req.file.path);

    uploadCSVBack(req.file.path, (err, insertedCount) => {
        // Borramos el archivo temporal luego de procesar
        fs.unlink(req.file.path, (errUnlink) => {
            if (errUnlink) console.error('Error deleting temporary file:', errUnlink);
        });

        if (err) {
            console.error('Error en uploadCSVBack:', err);
            return res.status(500).json({ message: "Error executing CSV", error: err.message });
        }
        res.json({ message: "CSV ejecutado correctamente", inserted: insertedCount });
    });
});

// GET - Listar todos
app.get('/client', (req, res) => {
    const sql = 'SELECT * FROM client';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(result);
    });
});

// POST - Nuevo empleado
app.post('/client', (req, res) => {
    const { name,identification,address,phone,email} = req.body;
    const sql = 'INSERT INTO client (name, identification,address,phone,email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, identification,address,phone,email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: "cliente agregado", id: result.insertId });
    });
});

// PUT - Actualizar por ID
app.put('/client/:id', (req, res) => {
    const { id } = req.params;
    const { name,identification,address,phone,email} = req.body;
    const sql = `
        UPDATE client
        SET name=?, identification=?,address=?,phone=?,email=?
        WHERE id=?`;
    db.query(sql, [name,identification,address,phone,email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
        res.json({ success: true });
    });
});

// DELETE - Eliminar por ID
app.delete('/client/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM client WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ success: true });
    });
});

// =====================
// SERVIR FRONTEND
// =====================
app.use(express.static(path.join(__dirname, '../frontend')));

// =====================
// INICIAR SERVIDOR
// =====================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
