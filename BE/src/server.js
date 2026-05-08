import app from "./app.js";
import env from "./config/env.js";
import { fileURLToPath } from "url";

function startServer() {
  const server = app.listen(env.port, () => {
    console.log(
      `Pixpress BE listening on http://localhost:${env.port}${env.apiPrefix}`,
    );
  });

  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export { startServer };
