export {extendLocale} from 'prismui-core';

export declare const i18n: (key: string, data?: any) => string;
export declare const appI18n: (key: string, data?: any) => string;
export declare const currentLocale: () => string;
export declare const setLocale: (locale: string) => void;
export declare function translate(
  value: string,
  props?: {key?: string; data?: any; appId?: string}
): string;
