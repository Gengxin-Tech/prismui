import {
  extendLocale,
  makeTranslator,
  resolveVariable,
  setDefaultLocale
} from 'prismui-core';

export {extendLocale};

const localStorageKey = 'suda-i18n-locale';

function getStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch (error) {
    return null;
  }
}

function getStoredLocale(key) {
  return getStorage()?.getItem(key) || '';
}

function localeMap(locale) {
  locale = locale || 'zh-CN';
  locale = locale.indexOf('en') !== -1 ? 'en-US' : locale;
  locale = locale.indexOf('zh') !== -1 || locale.indexOf('cn') !== -1 ? 'zh-CN' : locale;
  return locale;
}

const systemLocale = localeMap(
  typeof navigator === 'undefined'
    ? 'zh-CN'
    : navigator.language || navigator.userLanguage || 'zh-CN'
);

export const currentLocale = () => getStoredLocale(localStorageKey) || systemLocale;

export const i18n = makeTranslator(currentLocale());

export const appI18n = (key, data) => {
  let curI18Key = currentLocale();
  const appId = typeof window === 'undefined' ? '' : window.store?.app?.id;

  if (appId) {
    curI18Key = getStoredLocale(`app_${appId}_i18n_locale`) || curI18Key;
  }

  return makeTranslator(curI18Key)(key, data);
};

setDefaultLocale(currentLocale());

export const setLocale = locale => {
  getStorage()?.setItem(localStorageKey, locale);

  if (typeof location !== 'undefined' && typeof location.reload === 'function') {
    location.reload();
  }
};

function format(str, data) {
  return String(str).replace(/(\\)?\{\{([\s\S]+?)\}\}/g, (_, escape, key) => {
    if (escape) {
      return _.substring(1);
    }

    return resolveVariable(key, data || {});
  });
}

export function translate(value, props) {
  const {key, data, appId} = props || {};

  if (!key) {
    return format(value, data);
  }

  const locale = getStoredLocale(`${appId}-${localStorageKey}`) || currentLocale();
  const res = makeTranslator(locale)(key, data);

  return res === key ? format(value, data) : res;
}
