// 这个文件编译不会包裹，所以手动包裹一下。
(function () {
  const __moduleId = (str: string) => '';

  const mapping: {
    [propName: string]: any;
  } = {
    'react': __moduleId('react'),
    'react-dom': __moduleId('react-dom'),
    'immutability-helper': __moduleId('immutability-helper'),
    'react-cropper': __moduleId('react-cropper'),
    'react-dropzone': __moduleId('react-dropzone'),
    'classnames': __moduleId('classnames'),
    'axios': __moduleId('axios'),
    'exceljs': __moduleId('exceljs'),
    'moment': __moduleId('moment'),
    'mobx': __moduleId('mobx'),
    'mobx-react': __moduleId('mobx-react'),
    'mobx-state-tree': __moduleId('mobx-state-tree'),
    'react-transition-group': __moduleId('react-transition-group'),
    'papaparse': __moduleId('papaparse'),
    'echarts': __moduleId('echarts'),
    'zrender': __moduleId('zrender'),
    'sortablejs': __moduleId('sortablejs'),
    'prismui': __moduleId('prismui-framework/lib/minimal'),
    'prismui/full': __moduleId('prismui-framework'),
    'prismui@@version': __moduleId('prismui-framework/lib/minimal'),
    'prismui@@version/full': __moduleId('prismui-framework'),
    'prismui/embed': __moduleId('./embed.tsx'),
    'prismui@@version/embed': __moduleId('./embed.tsx'),
    'prop-types': __moduleId('prop-types'),
    'qs': __moduleId('qs'),
    'path-to-regexp': __moduleId('path-to-regexp'),
    'history': __moduleId('history'),
    'tslib': __moduleId('tslib'),
    'prismui-ui': __moduleId('prismui-ui'),
    'prismui-core': __moduleId('prismui-core'),
    'prismui-formula': __moduleId('prismui-formula'),
    'copy-to-clipboard': __moduleId('copy-to-clipboard')
  };

  Object.keys(mapping).forEach(key => {
    (window as any).amis.require.aliasMapping[key] = mapping[key];
  });

  (window as any).amisRequire = (window as any).amis.require;
  (window as any).prismuiRequire = (window as any).amis.require;
})();
