const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const connection = require('./db');

const uploadCSVBack = () => {

    const result=[];
    const filePath = path.join(__dirname, 'employees.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) =>{
        result.push(row);
    });

    result.forEach((empleado) =>{
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
            empleado.age
        ];


    connection.query(query, values, (err, result)=>{
        if(err){
            console.error("Error al insertar");
        } else {
            console.log(`"Empleado insertado" ${result.insertId}`);
        }
    });
  });
};

module.exports = { uploadCSVBack };
