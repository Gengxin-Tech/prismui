import {
  applyThemeScope,
  getClassPrefix,
  getNearestThemeScope,
  getTheme,
  getThemeScope,
  getThemeScopeProps,
  getStableClassName,
  getStableClassSelector,
  makeStableClassnames,
  resolveOverlayContainer,
  theme
} from '../src/theme';

afterEach(() => {
  theme('prismui', {
    componentClassPrefix: 'prismui-'
  });
});

test('theme runtime uses stable component classnames by default', () => {
  const cx = getTheme('prismui').classnames;

  expect(cx('Button', 'Button--primary', 'is-disabled')).toBe(
    'prismui-Button prismui-Button--primary is-disabled'
  );
});

test('theme runtime exposes stable component classPrefix to components', () => {
  theme('prismui', {
    classPrefix: 'prismui-',
    componentClassPrefix: 'prismui-'
  });

  expect(getClassPrefix()).toBe('prismui-');
  expect(getTheme('prismui').componentClassPrefix).toBe('prismui-');
});

test('theme runtime exposes a data attribute scope', () => {
  expect(getThemeScope('prismui')).toMatchObject({
    theme: 'prismui',
    attribute: 'data-prismui-theme',
    value: 'prismui',
    selector: '[data-prismui-theme="prismui"]',
    tokenScopeSelector: '[data-prismui-theme="prismui"]'
  });

  expect(getThemeScopeProps('prismui')).toEqual({
    'data-prismui-theme': 'prismui'
  });
  expect(getTheme('default').scope.value).toBe('prismui');
});

test('makeStableClassnames prefixes only component tokens', () => {
  const cx = makeStableClassnames();

  expect(cx('Button', ':Button--quiet', 'is-active', 'custom-class')).toBe(
    'prismui-Button Button--quiet is-active custom-class'
  );
});

test('stable class selector helpers prefer the primary component class', () => {
  const cx = getTheme('prismui').classnames;

  expect(getStableClassName(cx, 'Modal-content')).toBe('prismui-Modal-content');
  expect(getStableClassSelector(cx, 'Modal-content')).toBe(
    '.prismui-Modal-content'
  );
});

test('theme classnames do not emit a legacy alias', () => {
  expect(getTheme('prismui').classnames('Button')).toBe('prismui-Button');

  theme('prismui', {
    classPrefix: 'prismui-'
  });

  expect(getTheme('prismui').classnames('Button', 'Button--primary')).toBe(
    'prismui-Button prismui-Button--primary'
  );
});

test('overlay theme helpers resolve nearest DOM scope', () => {
  const root = document.createElement('div');
  const child = document.createElement('div');
  root.setAttribute('data-prismui-theme', 'dark');
  root.appendChild(child);

  expect(getNearestThemeScope(child)).toMatchObject({
    theme: 'dark',
    value: 'dark',
    selector: '[data-prismui-theme="dark"]'
  });
  expect(getNearestThemeScope(document.createElement('div'))).toBeNull();
});

test('overlay theme helpers apply scope idempotently', () => {
  const node = document.createElement('div');
  const prismuiScope = getThemeScope('prismui');
  const darkScope = getThemeScope('dark');

  expect(applyThemeScope(node, prismuiScope)).toBe(prismuiScope);
  expect(node).toHaveAttribute('data-prismui-theme', 'prismui');
  expect(applyThemeScope(node, darkScope)).toMatchObject({
    value: 'prismui'
  });
  expect(node).toHaveAttribute('data-prismui-theme', 'prismui');
});

test('overlay container resolver preserves custom container scope', () => {
  const fallback = document.createElement('div');
  const custom = document.createElement('div');
  custom.setAttribute('data-prismui-theme', 'dark');
  const customResolution = resolveOverlayContainer(
    custom,
    fallback,
    getThemeScope('prismui')
  );

  expect(customResolution.container).toBe(custom);
  expect(customResolution.scope).toMatchObject({
    theme: 'dark',
    value: 'dark',
    selector: '[data-prismui-theme="dark"]'
  });
  expect(resolveOverlayContainer(null, fallback, getThemeScope('prismui'))).toEqual(
    {
      container: fallback,
      scope: getThemeScope('prismui')
    }
  );
});
