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
      console.error('Error reading CSV:', err);
      callback(err);
    })
    .on('end', () => {
      if (results.length === 0) {
        return callback(null, 0);
      }

      let insertedCount = 0;
      let hasError = false;

      results.forEach((empleado, index) => {
        const query = `INSERT INTO client(name,identification,address,phone,email)
                       VALUES(?,?,?,?,?)`;

        const values = [
          client.name,
          client.identification,
          client.address,
          client.phone,
          client.email, 
        ];

        connection.query(query, values, (err, res) => {
          if (err) {
            console.error('Error inserting client:', err);
            hasError = true;
          } else {
            insertedCount++;
            console.log(`Empleado insertado con id ${res.insertId}`);
          }

          // Al terminar todas las inserciones, se llama callback
          if (index === results.length - 1) {
            if (hasError) {
              callback(new Error('Error inserting one or more employees'));
            } else {
              callback(null, insertedCount);
            }
          }
        });
      });
    });
};

module.exports = { uploadCSVBack };
