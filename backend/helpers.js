const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const connection = require('./db');

const uploadCSVBack = (filePath, callback) => {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('error', (err) => {
      console.error('Error leyendo CSV:', err);
      callback(err);
    })
    .on('end', () => {
      if (results.length === 0) {
        return callback(null, 0);
      }

      let insertedCount = 0;
      let hasError = false;

      results.forEach((empleado, index) => {
        const query = `INSERT INTO employees(name, lastname, lastname2, email, charge, city, salary, age)
                       VALUES(?,?,?,?,?,?,?,?)`;

        const values = [
          empleado.name,
          empleado.lastname,
          empleado.lastname2,
          empleado.email,
          empleado.charge,
          empleado.city,
          empleado.salary,
          empleado.age,
        ];

        connection.query(query, values, (err, res) => {
          if (err) {
            console.error('Error al insertar empleado:', err);
            hasError = true;
            // Opcional: podrías devolver el error inmediato, pero aquí se sigue para intentar todos
          } else {
            insertedCount++;
            console.log(`Empleado insertado con id ${res.insertId}`);
          }

          // Al terminar todas las inserciones, se llama callback
          if (index === results.length - 1) {
            if (hasError) {
              callback(new Error('Error al insertar uno o más empleados'));
            } else {
              callback(null, insertedCount);
            }
          }
        });
      });
    });
};

module.exports = { uploadCSVBack };
