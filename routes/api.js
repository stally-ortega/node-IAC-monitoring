const express = require('express');
const router = express.Router();
const { connect } = require('../mongoClient');

const crearRuta = (path, coleccion) => {
  router.get(`/${path}`, async (req, res) => {
    try {
      const db = await connect();
      const collection = db.collection(coleccion);

      const { from, limit } = req.query;
      const query = {};

      // Filtro de fecha (solo YYYY-MM-DD)
      if (from) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
          return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD' });
        }

        const fecha = new Date(`${from}T00:00:00.000Z`);
        if (!isNaN(fecha)) {
          query.timestamp = { $gte: fecha };
        } else {
          return res.status(400).json({ error: 'Fecha no válida' });
        }
      }

      // Aplicar límite (por defecto: sin límite)
      let cursor = collection.find(query);
      if (limit && !isNaN(parseInt(limit))) {
        cursor = cursor.limit(parseInt(limit));
      }

      const data = await cursor.toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Definir rutas
crearRuta('orders', 'order_executions');
crearRuta('predictions', 'predictions');
crearRuta('realtime_data_1d', 'realtime_data_1d');
crearRuta('realtime_data_1h', 'realtime_data_1h');
crearRuta('realtime_data_4h', 'realtime_data_4h');

module.exports = router;