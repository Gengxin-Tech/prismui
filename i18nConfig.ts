export default {
  entry: {
    dir: './packages/prismui-editor-core/src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    list: [
      'packages/**/locale/*',
      'packages/prismui-framework/*',
      'packages/prismui-ui/*',
      'packages/prismui-core/*',
      'packages/prismui-formula/*',
      'packages/**/examples/*'
    ]
  },
  importInfo: {
    source: 'prismui-i18n-runtime',
    imported: 'i18n',
    local: '_i18n'
  },
  i18nModule: 'prismui-i18n-runtime',
  languages: [
    {
      name: 'en-US',
      path: [
        './packages/prismui-editor-core/src/locale',
        './packages/prismui-editor/src/locale'
      ]
    },
    {
      name: 'zh-CN',
      path: [
        './packages/prismui-editor-core/src/locale',
        './packages/prismui-editor/src/locale'
      ]
    }
  ]
};
