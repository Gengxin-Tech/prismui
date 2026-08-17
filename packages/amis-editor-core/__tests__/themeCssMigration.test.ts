import {
  getCssVarById,
  JSONPipeIn,
  migrateLegacyThemeSelector,
  THEME_CSS_MIGRATION_WARNINGS_KEY
} from '../src/util';
import {theme} from 'amis-core';

describe('theme CSS schema migration', () => {
  it('moves legacy style into themeCss and warns when dropping old amis prefix selector keys', () => {
    const migrated = JSONPipeIn({
      'type': 'page',
      'style': {
        background: '#fff',
        color: '#333'
      },
      '.amis-Page-title': {
        color: 'red'
      }
    });

    expect(migrated.style.background).toBeUndefined();
    expect(migrated.style.color).toBeUndefined();
    expect(migrated.themeCss.baseControlClassName).toMatchObject({
      'background:default': '#fff',
      'font:default': {
        color: '#333'
      }
    });
    expect(migrated['.amis-Page-title']).toBeUndefined();
    expect(migrated[THEME_CSS_MIGRATION_WARNINGS_KEY]).toContain(
      'removed legacy selector .amis-Page-title; stable candidate .prismui-Page-title'
    );
  });

  it('uses the configured component prefix for legacy selector candidates', () => {
    theme('branded-migration-prefix', {
      componentClassPrefix: 'brand-' as any
    });

    expect(
      migrateLegacyThemeSelector(
        '.amis-Page-title .amis-Button',
        'branded-migration-prefix'
      )
    ).toBe('.brand-Page-title .brand-Button');
  });

  it('reads only CSS custom properties from theme scoped rules', () => {
    const style = document.createElement('style');
    style.id = 'themeCss';
    style.appendChild(
      document.createTextNode(`
        [data-prismui-theme="custom"] {
          --prismui-color-brand: #2468f2;
        }

        [data-prismui-theme="custom"] .prismui-Button--accent {
          color: var(--button-accent-default-font-color);
          background: red;
        }
      `)
    );
    document.head.appendChild(style);

    expect(getCssVarById('themeCss', '[data-prismui-theme')).toEqual({
      '--prismui-color-brand': '#2468f2'
    });

    document.head.removeChild(style);
  });
});
