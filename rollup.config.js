import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

function config({ format, minify = true, input, ext = 'js' }) {
  const dir = `dist`;

  return {
    input: `./src/${input}.js`,
    output: {
      name: 'index',
      file: `${dir}/reackt.${format}.${ext}`,
      format,
      sourcemap: true,
    },
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
      }),
      minify
        ? terser({
            sourcemap: true,
            compress: true,
            mangle: true,
          })
        : undefined,
    ].filter(Boolean),
    external: ['redux', 'immer'],
  };
}

require('rimraf').sync('dist');

export default [
  { input: 'index', format: 'esm' },
  { input: 'index', format: 'cjs' },
].map(config);
