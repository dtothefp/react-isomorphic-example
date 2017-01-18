import 'babel-polyfill';
import gulp from 'gulp';
import req from 'require-dir';
import webpack from 'webpack';
import koa from 'koa';
import path from 'path';

const dirs = req('./tasks');
const plugins = {
  koa,
  webpack
};
const config = {
  src: 'src',
  dest: 'dist',
  cwd: path.join.bind(path, process.cwd())
};
const tasks = Object.keys(dirs).reduce((acc, task) => ({
  ...acc,
  [task]: dirs[task](gulp, plugins, config)
}), {});

gulp.task('webpack', tasks.webpack);
gulp.task('koa', tasks.koa);
gulp.task('default', gulp.series('webpack', 'koa'));

