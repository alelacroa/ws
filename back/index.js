
const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
require('dotenv').config()


// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://form-365.netlify.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

const connection = mysql.createConnection(process.env.DATABASE_URL)

connection.connect(function(error) {
    if (error) {
      console.error('Error al conectar: ' + error.stack);
      return;
    }
    console.log('Conectado como ID: ' + connection.threadId);
  });

  
const axios = require('axios');
const qs = require('querystring');

app.post('/back', (req, res) => {
  const { nombre, apellido, email, telefono, carrera } = req.body;
  const sql = `INSERT INTO form_submissions (nombre, apellido, email, telefono, carrera)
              VALUES ('${nombre}', '${apellido}', '${email}', '${telefono}', '${carrera}')`;

  connection.connect(function(error) {
    if (error) {
      return res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }

    connection.query(sql, function(error, result) {
      if (error) {
        return res.status(500).json({ error: 'Error de consulta SQL' });
      }

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

      axios.post(url, qs.stringify(params), config)
        .then(response => {
          console.log(response.data);
          return res.json({ success: true });
        })
        .catch(error => {
          console.log(error);
          return res.status(500).json({ error: 'Error en la llamada a la API' });
        });
    });
  });
});

app.get('/hello', (req, res) => {
  res.send('hola cuna')
})

  
const port = 8000;
  app.listen(8000, function() {
    console.log('Server running');
  });