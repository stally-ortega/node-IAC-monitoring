require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });

let db = null;

async function connect() {
  if (!db) {
    await client.connect();
    const dbName = new URL(process.env.MONGO_URI).pathname.substring(1);
    db = client.db(dbName);
  }
  return db;
}

module.exports = { connect };