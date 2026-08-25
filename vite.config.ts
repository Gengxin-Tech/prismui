import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import replace from '@rollup/plugin-replace';
import fis3 from './scripts/fis3plugin';
import markdown from './scripts/markdownPlugin';
import mockApi from './scripts/mockApiPlugin';
import transformMobileHtml from './scripts/transformMobileHtml';
//@ts-ignore
import i18nPlugin from 'plugin-react-i18n';
import i18nConfig from './i18nConfig';

const monacoWorkerMiddleware = require(
  'vite-plugin-monaco-editor/dist/workerMiddleware'
) as {cacheDir: string};

var I18N = process.env.I18N;
var MONACO_WORKER_DIR = process.env.AMIS_MONACO_WORKER_DIR;

function realpathIfExists(filepath: string) {
  try {
    return fs.realpathSync.native(filepath);
  } catch (error) {
    return '';
  }
}

function nodeModulesRootFor(filepath: string) {
  const marker = `${path.sep}node_modules${path.sep}`;
  const index = filepath.lastIndexOf(marker);
  return index === -1 ? '' : filepath.slice(0, index + marker.length - 1);
}

function linkedNodeModulesRoots(root: string) {
  const nodeModulesDir = path.resolve(root, 'node_modules');
  try {
    return fs
      .readdirSync(nodeModulesDir, {withFileTypes: true})
      .flatMap(entry => {
        const entryPath = path.join(nodeModulesDir, entry.name);
        if (entry.name.startsWith('@') && entry.isDirectory()) {
          return fs
            .readdirSync(entryPath)
            .map(name => path.join(entryPath, name));
        }
        return [entryPath];
      })
      .map(realpathIfExists)
      .map(nodeModulesRootFor)
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

const viteFsAllow = Array.from(
  new Set(
    [
      __dirname,
      path.resolve(__dirname, 'node_modules'),
      realpathIfExists(path.resolve(__dirname, 'node_modules')),
      realpathIfExists(path.resolve(__dirname, 'node_modules/monaco-editor')),
      ...linkedNodeModulesRoots(__dirname),
      ...(process.env.AMIS_VITE_FS_ALLOW
        ? process.env.AMIS_VITE_FS_ALLOW.split(path.delimiter)
        : [])
    ].filter(Boolean)
  )
);

if (MONACO_WORKER_DIR) {
  monacoWorkerMiddleware.cacheDir = `${path.resolve(MONACO_WORKER_DIR)}${
    path.sep
  }`;
}

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: process.env.AMIS_VITE_CACHE_DIR || 'node_modules/.vite',
  plugins: [
    I18N && i18nPlugin(i18nConfig),

    fis3(),
    markdown(),
    mockApi(),
    transformMobileHtml(),

    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        svgProps: {
          className: 'icon'
        },
        prettier: false,
        dimensions: false
      }
    }),
    monacoEditorPlugin({
      customDistPath: (root, buildOutDir, base) =>
        process.env.AMIS_MONACO_WORKER_DIR ||
        path.resolve(root, 'node_modules/.monaco')
    }),
    replace({
      __editor_i18n: !!I18N,
      preventAssignment: true
    })
  ].filter(n => n),
  optimizeDeps: {
    include: ['prismui-formula/lib/doc'],
    exclude: [
      'prismui-core',
      'prismui-formula',
      'prismui',
      'prismui-ui',
      'qrcode-react-next'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8888,
    fs: {
      allow: viteFsAllow
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale'
      },
      {
        find: 'prismui-formula/lib',
        replacement: path.resolve(__dirname, './packages/prismui-formula/src')
      },
      {
        find: 'prismui-formula',
        replacement: path.resolve(__dirname, './packages/prismui-formula/src')
      },
      {
        find: 'prismui-ui/lib',
        replacement: path.resolve(__dirname, './packages/prismui-ui/src')
      },
      {
        find: 'prismui-ui',
        replacement: path.resolve(__dirname, './packages/prismui-ui/src')
      },
      {
        find: 'prismui-core',
        replacement: path.resolve(__dirname, './packages/prismui-core/src')
      },
      {
        find: 'prismui-framework/lib',
        replacement: path.resolve(__dirname, './packages/prismui-framework/src')
      },
      {
        find: 'prismui-framework/schema.json',
        replacement: path.resolve(
          __dirname,
          './packages/prismui-framework/schema.json'
        )
      },
      {
        find: 'prismui-framework',
        replacement: path.resolve(__dirname, './packages/prismui-framework/src')
      },
      {
        find: 'prismui/lib',
        replacement: path.resolve(__dirname, './packages/prismui-framework/src')
      },
      {
        find: 'prismui/schema.json',
        replacement: path.resolve(__dirname, './packages/prismui-framework/schema.json')
      },
      {
        find: 'prismui',
        replacement: path.resolve(__dirname, './packages/prismui-framework/src')
      },
      {
        find: 'prismui-editor',
        replacement: path.resolve(__dirname, './packages/prismui-editor/src')
      },
      {
        find: 'prismui-editor-core',
        replacement: path.resolve(__dirname, './packages/prismui-editor-core/src')
      },
      {
        find: 'prismui-office-viewer',
        replacement: path.resolve(__dirname, './packages/prismui-office-viewer/src')
      },
      {
        find: 'prismui-theme-editor-helper',
        replacement: path.resolve(
          __dirname,
          './packages/prismui-theme-editor-helper/src'
        )
      }
    ]
  }
});
