# CRUD de Empleados con Node.js, MySQL y Bootstrap

Este proyecto es una aplicación web para gestionar empleados usando Node.js, Express, MySQL y Bootstrap 5.  
Incluye funciones de crear, leer, actualizar y eliminar registros, con interfaz responsive y soporte para importar datos desde un archivo CSV.

---

## Características

- Listado de empleados con datos como nombre, apellidos, correo, cargo, ciudad, salario y edad.
- Modal para agregar y editar empleados.
- Botones para eliminar y editar registros.
- Botón para cargar datos desde CSV.
- Actualización automática de la tabla sin recargar la página.
- Interfaz limpia y responsive con Bootstrap 5.

---

## Estructura del proyecto

```
proyecto-crud
 ┣ backend
 ┃ ┣ db.js         # Conexión a MySQL
 ┃ ┣ index.js      # Servidor y API REST
 ┃ ┣ helpers.js    # Funciones auxiliares (CSV)
 ┣ frontend
 ┃ ┣ index.html    # Interfaz de usuario
 ┃ ┣ main.js       # Lógica del CRUD en el cliente
 ┣ package.json    # Dependencias del proyecto
 ┗ README.md       # Documentación
```

---

## Instalación y configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/usuario/proyecto-crud.git
   cd proyecto-crud
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Crear una base de datos en MySQL:
     ```sql
     CREATE DATABASE empleados_db;
     ```
   - Crear la tabla:
     ```sql
     CREATE TABLE employees (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(100),
         lastname VARCHAR(100),
         lastname2 VARCHAR(100),
         email VARCHAR(100),
         charge VARCHAR(100),
         city VARCHAR(100),
         salary DECIMAL(10,2),
         age INT
     );
     ```
   - Editar el archivo `backend/db.js` con las credenciales de MySQL.

4. **Iniciar el servidor**
   ```bash
   node backend/index.js
   ```
   El servidor estará disponible en:  
   `http://localhost:3000`

---

## Uso

1. Abrir `http://localhost:3000` en el navegador.
2. Usar el botón **"Agregar empleado"** para registrar un nuevo empleado.
3. Editar registros usando el botón **"Editar"**.
4. Eliminar registros con el botón **"Eliminar"**.
5. Usar **"Execute CSV"** para importar empleados desde un archivo `.csv`.

---

## Dependencias principales

- [Express](https://expressjs.com/) – Servidor web para Node.js.
- [MySQL](https://www.mysql.com/) – Base de datos relacional.
- [Bootstrap 5](https://getbootstrap.com/) – Estilos y diseño responsive.
- [Body-parser](https://www.npmjs.com/package/body-parser) – Procesamiento de JSON.
- [Cors](https://www.npmjs.com/package/cors) – Permitir solicitudes entre dominios.

---


