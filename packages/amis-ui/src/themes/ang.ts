import {theme, ClassNamesFn, makeClassnames} from 'prismui-core';
export const classPrefix: string = 'prismui-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('ang', {
  classPrefix,
  componentClassPrefix: 'prismui-',
  classnames
});
