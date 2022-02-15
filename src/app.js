// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import http from 'http';
import { debug } from './utils/debug.js';
import { reply } from './reply.js';
import { validateRequest } from './utils/validation.js';

const server = http.createServer(async (req, res) => {
  // Set the request route.
  if (req.url === '/' && req.method === 'POST') {
    // Computing the `rawBody` and `body` of the request.
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    req.rawBody = Buffer.concat(buffers).toString();
    req.body = JSON.parse(req.rawBody);

    // Fail fast if the request is not coming from the Business Messages API.
    const isValidRequest = validateRequest(
      req.rawBody,
      req.headers['x-goog-signature']
    );
    if (!isValidRequest) {
      res.writeHead(401);
      return res.end();
    }

    let responseBody;

    try {
      responseBody = await reply(req);
    } catch (err) {
      debug(err);
    }

    // Set the status code and content-type
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Set the response body.
    res.write(responseBody);

    // End the response.
    res.end();
  } else {
    // If no route present:
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

/**
 * Start the server.
 */
server.listen(process.env.PORT || 3000);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error
 * @return {void}
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Server listening on ' + bind);
}
