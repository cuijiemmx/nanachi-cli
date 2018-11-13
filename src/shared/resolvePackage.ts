import * as spinner from '@shared/spinner';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import resolve from 'resolve';
import { getAnuPath } from '../commands/build/utils';
import { hackExt } from './hack';

const alias: {
  [property: string]: string;
} = {};

interface IPkg {
  [property: string]: string;
}

function packageFilter(pkg: IPkg, pkgPath: string) {
  const pkgRoot = path.dirname(pkgPath);
  
  if (pkg['module']) {
    pkg['main'] = pkg['module'];
  } else if (pkg[ 'jsnext:main']) {
    pkg['main'] = pkg['jsnext:main'];
  } 
  return pkg;
}

export const resolvePackage = (
  name: string,
  basedir: string,
  target: string
) => {
  console.log('resolving ', name, ' FROM ', basedir)

  // 缓存
  if (!alias[name]) {
    const realBasedir = name.startsWith('.') ? basedir : process.cwd()
  
    if (name === 'react') {
      alias[name] = getAnuPath(target);
    } else if (name.startsWith('@components')) {
      alias[name] = path.resolve(
        realBasedir,
        'components',
        name
          .split('/')
          .slice(1)
          .join('/')
      );
    } else {
      // 尝试解析
      try {
        const resolved = resolve.sync(name, {
          basedir: realBasedir,
          extensions: ['.mjs', '.js', '.json', '.node'],
          packageFilter
        });
        alias[name] = hackExt(resolved)
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
    }
  }

  console.log('resolved: ', alias[name])
  return alias[name];
};
