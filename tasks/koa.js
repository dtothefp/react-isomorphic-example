import fs from 'fs';

export default function(gulp, plugins, config) {
  const {cwd} = config;
  const {koa: Koa} = plugins;

  return cb => {
    const app = new Koa();

    // response
    app.use(ctx => {
      if (ctx.request.url === '/') {
        ctx.body = fs.readFileSync(cwd('src/index.html'), 'utf8');
      }
    });

    app.listen(3000, cb);
  };
}
