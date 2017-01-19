import express from 'express';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

export default function(gulp, plugins, config) {
  const {webpack} = plugins;
  const {cwd, dest} = config;
  const hotPort = '8080';
  const publicPath = `http://localhost:${hotPort}/`;
  const hmrOpts = [
    `path=${publicPath}__webpack_hmr`,
    // 'reload=true',
  ];
  const wpConfig = {
    entry: [
      `webpack-hot-middleware/client?${hmrOpts.join('&')}`,
      './src/index.js'
    ],
    output: {
      path: cwd(dest),
      filename: 'main.js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { modules: false }],
              'es2017',
              'react'
            ],
            plugins: [
              [`transform-regenerator`, {
                asyncGenerators: true,
                generators: true,
                async: false
              }],
              // [
              // `transform-runtime`, {
              // polyfill: false,
              // regenerator: true,
              // },
              // ],
              [ `react-transform`, {
                transforms: [{
                  transform: `react-transform-hmr`,
                  imports: [`react`],
                  locals: [`module`],
                }, {
                  transform: `react-transform-catch-errors`,
                  imports: [ `react`, `redbox-react` ],
                }],
              }],
            ]
          }
        }
      ]
    }
  };

  return cb => {
    const compiler = webpack(wpConfig);
    const app = express();
    const serverOptions = {
      contentBase: dest,
      hot: true,
      inline: true,
      lazy: false,
      publicPath,
      headers: {'Access-Control-Allow-Origin': '*'},
      stats: {colors: true},
    };
    let hasRun = false;

    app.use(devMiddleware(compiler, serverOptions));
    app.use(hotMiddleware(compiler));

    compiler.plugin('done', (stats) => {
      if (!hasRun) {
        hasRun = true;
        app.listen(hotPort, (err) => {
          if (err) {
            console.error(err);
            return cb(err);
          }
          console.info('==> 🚧  Webpack development server listening on port %s', hotPort);
          cb();
        });
      }
    });
  };
}
