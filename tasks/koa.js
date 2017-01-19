import proxy from 'koa-proxy';
import convert from 'koa-convert';
import fs from 'fs';

export default function(gulp, plugins, config) {
  const {cwd} = config;
  const {koa: Koa} = plugins;

  return cb => {
    const app = new Koa();

    app.use(convert(proxy({
      host: 'http://localhost:8080',
      match: /\.hot-update\.js(on)?$/
    })));

    // response
    app.use(ctx => {
      if (ctx.request.url === '/') {
        ctx.body = fs.readFileSync(cwd('src/index.html'), 'utf8');
      }
    });

    app.listen(3000, cb);
  };
}
