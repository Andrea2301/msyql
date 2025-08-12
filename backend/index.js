const express = require('express');
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
    console.log(`📡 ${req.method} ${req.url}`);
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
            if (errUnlink) console.error('Error borrando archivo temporal:', errUnlink);
        });

        if (err) {
            console.error('Error en uploadCSVBack:', err);
            return res.status(500).json({ message: "Error ejecutando CSV", error: err.message });
        }
        res.json({ message: "CSV ejecutado correctamente", inserted: insertedCount });
    });
});

// GET - Listar todos
app.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM employees';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(result);
    });
});

// POST - Nuevo empleado
app.post('/employees', (req, res) => {
    const { name, lastname, lastname2, email, charge, city, salary, age } = req.body;
    const sql = 'INSERT INTO employees (name, lastname, lastname2, email, charge, city, salary, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, lastname, lastname2, email, charge, city, salary, age], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: "Empleado agregado", id: result.insertId });
    });
});

// PUT - Actualizar por ID
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, lastname, lastname2, email, charge, city, salary, age } = req.body;
    const sql = `
        UPDATE employees 
        SET name=?, lastname=?, lastname2=?, email=?, charge=?, city=?, salary=?, age=?
        WHERE id=?`;
    db.query(sql, [name, lastname, lastname2, email, charge, city, salary, age, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
        res.json({ success: true });
    });
});

// DELETE - Eliminar por ID
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
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
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
