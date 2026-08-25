import {theme, ClassNamesFn, makeClassnames} from 'prismui-core';
export const classPrefix: string = 'prismui-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('dark', {
  classPrefix,
  componentClassPrefix: 'prismui-',
  classnames,
  renderers: {
    'json': {
      jsonTheme: 'eighties'
    },
    'editor-control': {
      editorTheme: 'vs-dark'
    }
  }
});
