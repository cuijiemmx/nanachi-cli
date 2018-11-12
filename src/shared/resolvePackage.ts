import * as spinner from '@shared/spinner';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import resolve from 'resolve';
import { getAnuPath } from '../commands/build/utils';

const alias: {
  [property: string]: string;
} = {};

export const resolvePackage = (
  name: string,
  basedir: string,
  target: string
) => {
  const realBasedir = name.startsWith('.') ? basedir : process.cwd()

  if (name === 'react') {
    alias[name] = getAnuPath(target);
  }
  if (name.startsWith('@components')) {
    alias[name] =  path.resolve(
      realBasedir,
      'components',
      name
        .split('/')
        .slice(1)
        .join('/')
    );
    return alias[name]
  }
  // 缓存
  if (alias[name]) return alias[name];
  // 尝试解析
  let resolved;
  try {
    alias[name] = resolve.sync(name, { basedir: realBasedir, extensions: ['.js'] });
  } catch (error) {
    console.log('resolve FAILED')
    if (name === 'regenerator-runtime/runtime') {
      spinner.info(chalk`missing {cyan regenerator-runtime}`);
      spinner.start(chalk`installing {cyan regenerator-runtime}`);
      execSync('npm install regenerator-runtime', { cwd: process.cwd() });
    } else {
      throw error;
    }
  }
  return alias[name];
};
