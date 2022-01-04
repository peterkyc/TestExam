

import proxy from "http-proxy-middleware";

export function proxyServer(app) {
  const proxyUrl = process.env.API_URL;
  console.log(`proxyServer use ${proxyUrl}`);
  app.use(
    '/api/',
    proxy({
        target : proxyUrl,
        changeOrigin : true,  // 設置跨域請求
    })
);

}
