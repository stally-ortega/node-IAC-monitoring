require('dotenv').config();
const express = require('express');
const { connect } = require('./mongoClient');
const authMiddleware = require('./authMiddleware');

const app = express();
app.use(express.json());

// Middleware de autenticación para todas las rutas
app.use(authMiddleware);

// Ruta dinámica: consulta cualquier colección (solo lectura)
app.get('/:collection', async (req, res) => {
  try {
    const db = await connect();
    const collectionName = req.params.collection;
    const data = await db.collection(collectionName).find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});