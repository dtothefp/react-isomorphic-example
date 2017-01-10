export default function(gulp, plugins, config) {
  const {koa: Koa} = plugins;

  return cb => {
    const app = new Koa();

    // response
    app.use(ctx => {
      ctx.body = 'Hello Koa';
    });

    app.listen(3000, cb);
  };
}
