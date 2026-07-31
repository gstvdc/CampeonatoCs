import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context);
  }

  let resolvedPath = null;
  if (specifier.startsWith('@/')) {
    const projectRoot = process.cwd();
    const relativePath = specifier.replace('@/', 'src/');
    resolvedPath = path.resolve(projectRoot, relativePath);
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (context.parentURL) {
      const parentDir = path.dirname(new URL(context.parentURL).pathname);
      resolvedPath = path.resolve(parentDir, specifier);
    }
  }

  if (resolvedPath) {
    if (!fs.existsSync(resolvedPath)) {
      if (fs.existsSync(resolvedPath + '.ts')) {
        resolvedPath += '.ts';
      } else if (fs.existsSync(resolvedPath + '.tsx')) {
        resolvedPath += '.tsx';
      } else if (fs.existsSync(resolvedPath + '.js')) {
        resolvedPath += '.js';
      }
    }
    return nextResolve(pathToFileURL(resolvedPath).href, context);
  }

  return nextResolve(specifier, context);
}
