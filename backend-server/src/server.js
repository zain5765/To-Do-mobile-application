require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 3000;

async function start() {
  await connectDB();

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`API running on http://localhost:${port}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Run: lsof -ti:${port} | xargs kill -9`,
      );
      process.exit(1);
    }
    throw err;
  });
}

start().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
