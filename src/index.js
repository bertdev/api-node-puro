const http = require('http');
const routes = require('./routes');
const url = require('url');


const PORT = 3000;

const server = http.createServer((request, response) => { 
  const parsedUrl = new URL(`http://localhost:${PORT}${request.url}`);

  let { pathname } = parsedUrl;
  let id = null;

  console.log(`Endpoint: ${pathname} | Method: ${request.method}`);

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint > 1) {
    pathname = `${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((route) => (
    route.endpoint === pathname && route.method === request.method
  ));

  
  if (!route) {
    response.writeHead(404, {'content-type': 'text/html'});
    response.end(`Cannot ${request.method} ${pathname}`);
  } else {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, {'content-type': 'application/json'});
      response.end(JSON.stringify(body));
    };
    route.handler(request, response);
  }
});

server.listen(PORT, () => console.log(`🔥 Server started at http://localhost:${PORT}`));
