/**
 * backend/server.js
 *
 * Simple entry point to run the Express app in traditional Node environments.
 * Useful for hosting providers like OVH, Heroku, or any VPS where you control
 * the Node process instead of relying on Netlify Functions.
 */

import app from './src/app.js';

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Tea Analysis API listening on http://${displayHost}:${PORT}`);
});

function gracefulShutdown(signal) {
  if (signal) {
    console.log(`Received ${signal}. Shutting down server...`);
  }
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  // Force exit if close takes too long
  setTimeout(() => {
    console.error('Forcing shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default server;
