const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
require('dotenv').config()
const axios = require('axios');
const qs = require('querystring');

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://form-365.netlify.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log('Conectado como ID: ' + connection.threadId);
});

app.post('/back', async (req, res) => {
  const { nombre, apellido, email, telefono, carrera } = req.body;
  const sql = `INSERT INTO form_submissions (nombre, apellido, email, telefono, carrera)
              VALUES ('${nombre}', '${apellido}', '${email}', '${telefono}', '${carrera}')`;

  try {
    const connection = await pool.promise().getConnection();
    await connection.query(sql);
    await connection.release();

    const url = 'http://190.210.65.174/neoapi/webservice.asmx/ExecuteTask08';
    const params = {
      idTask: 20,
      param1: 'NA',
      param2: req.body.nombre,
      param3: req.body.apellido,
      param4: req.body.email,
      param5: req.body.telefono,
      param6: req.body.carrera,
      param7: 'BU.com/postgrado',
      param8: 'Llámame ahora'
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response = await axios.post(url, qs.stringify(params), config);
    console.log(response.data);
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error de conexión a la base de datos o llamada a la API' });
  }
});

app.get('/hello', (req, res) => {
  res.send('test')
})

const port = 8000;
app.listen(8000, function() {
  console.log('Server running');
});
