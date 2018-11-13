import * as path from 'path';

export const hackExt = (filePath: string) => {
  if (path.extname(filePath) === '.mjs') {
    return filePath.slice(0, -3) + 'js'
  } else {
    return filePath
  }
}