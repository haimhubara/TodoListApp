const { MongoClient } = require('mongodb');

let mongoClient;
let isConnected = false;

async function connectToDatabase(uri) {
  if (isConnected && mongoClient) {
    return mongoClient;
  }
  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  isConnected = true;
  return mongoClient;
}

function getDb(dbName = 'toDoList') {
  if (!mongoClient) {
    throw new Error('MongoDB client is not initialized. Call connectToDatabase first.');
  }
  return mongoClient.db(dbName);
}

function getCollection(collectionName, dbName = 'toDoList') {
  return getDb(dbName).collection(collectionName);
}

async function closeDatabase() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = undefined;
    isConnected = false;
  }
}

module.exports = {
  connectToDatabase,
  getDb,
  getCollection,
  closeDatabase,
};


