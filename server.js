require('dotenv').config();
const { connectToDatabase, closeDatabase } = require('./src/config/db');
const { createApp } = require('./src/app');

async function start() {
  try {
    await connectToDatabase(process.env.DATABASE_CONNECTION);
    const app = createApp();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log('Server listening on port ' + port);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

process.on('SIGINT', async () => {
  try {
    await closeDatabase();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});