import app from "./app.js";
import env from "./config/env.js";

function startServer() {
  const server = app.listen(env.port, () => {
    console.log(`Pixpress BE listening on http://localhost:${env.port}${env.apiPrefix}`);
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export { startServer };