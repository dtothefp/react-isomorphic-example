export default function(gulp, plugins, config) {
  const {webpack} = plugins;
  const {cwd, dest} = config;
  const wpConfig = {
    entry: [
      './src/index.js'
    ],
    output: {
      path: cwd(dest),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { 'modules': false }],
              'es2017',
              'react'
            ]
          }
        }
      ]
    }
  };

  return cb => {
    const compiler = webpack(wpConfig);

    compiler.run((err, stats) => {
      console.log(stats.toString());
      cb();
    })
  };
}
