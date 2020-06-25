import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import includepaths from 'rollup-plugin-includepaths'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    json(),
    typescript(),
    includepaths({
      path: ['./src'],
      extensions: ['.ts'],
    }),
  ],
  external: [
    'commander',
    'execa',
    'ora',
    'chalk',
    'ansi-escapes',
    'make-dir',
    'fs',
    'got',
    'tar',
    'child_process',
    'figlet',
    'prompts',
  ],
}
