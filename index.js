require('dotenv').config();
const express = require('express');
const apiRouter = require('./routes/api');
const authMiddleware = require('./authMiddleware');

const app = express();
app.use(express.json());

// Middleware de autenticación para todas las rutas
//app.use(authMiddleware);

// Rutas para consultar cualquier colecciones (solo lectura)
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000/api');
});