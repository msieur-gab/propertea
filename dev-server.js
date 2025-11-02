/**
 * Development Server for Tea Recommendation API
 *
 * Serves:
 * - Static HTML files (test-ui.html)
 * - API endpoint at /.netlify/functions/tea-recommendation
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './netlify/functions/tea-recommendation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API endpoint
  if (req.url === '/.netlify/functions/tea-recommendation' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        // Create mock Netlify event
        const event = {
          httpMethod: 'POST',
          body: body,
          headers: req.headers
        };

        // Call the handler
        const response = await handler(event);

        // Send response
        res.writeHead(response.statusCode, {
          'Content-Type': 'application/json',
          ...response.headers
        });
        res.end(response.body);
      } catch (error) {
        console.error('API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Internal server error',
          details: error.message
        }));
      }
    });

    return;
  }

  // Handle static files
  let filePath = req.url === '/' ? '/netlify/test-ui.html' : req.url;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║        Tea Recommendation API - Development Server             ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝\n`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📝 Test UI available at: http://localhost:${PORT}/netlify/test-ui.html`);
  console.log(`🔌 API endpoint: POST http://localhost:${PORT}/.netlify/functions/tea-recommendation`);
  console.log(`\n✨ Open your browser and navigate to http://localhost:${PORT}\n`);
  console.log(`Press Ctrl+C to stop the server.\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close();
  process.exit(0);
});
