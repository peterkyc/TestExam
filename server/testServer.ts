

import * as path from "path";
import * as fs from "fs";
import express from "express";
import serveStatic from "serve-static";
import cors from "cors";
import https from "https";
import http from "http";
import { proxyServer } from "./setupProxy";
import { testMain } from "./util";
function main() {
  const port = process.env.PORT || 8878;
  let isHttps = !!process.env.HTTPS, server, cert, key, cf, kf;
  const certf = process.env.SSL_CRT_FILE;
  const keyf = process.env.SSL_KEY_FILE;
  const app = express();
  const fp = file => path.join(process.cwd(), file);
  const staticPath = fp("build");
  const staticOpts: serveStatic.ServeStaticOptions = {
    index: "index.html",
    maxAge: 0,
    // setHeaders?: ((res: R, path: string, stat: any) => any) | undefined;
  };
  const listener = express.static(staticPath, staticOpts);
  const sPath = "/test";
  // Enable All CORS Requests
  app.use(cors());
  app.use(sPath, (req,res,next) => {
    // let p = path.join(sPath,)
    console.log(`serve[${req.originalUrl}]`);
    return listener(req,res,next);
  });
  proxyServer(app);
  if (isHttps) {
    try {
      cert = fs.readFileSync(cf = fp(certf));
      key = fs.readFileSync(kf = fp(keyf));
    } catch (e) {
      console.error(`cert file:${cf} or key file:${kf} read error:`, e);
      isHttps = false;
    }
  }
  if (isHttps) {
    server = https.createServer({ key, cert }, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(port, function () {
    console.log(`Example app listening at http${isHttps ? "s" : ""}://localhost:${port}`);
  });
  // app.listen(port, () => {
  //   console.log(`Example app listening at http://localhost:${port}`);
  // });
}

if (testMain(__filename)) {
  main();
}