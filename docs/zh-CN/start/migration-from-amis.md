---
title: 从 amis 迁移到 PrismUI
description: 已有 amis 项目迁移到 PrismUI 的依赖、入口、API、样式和主题指南。
---

本文适用于从 amis 迁移到 PrismUI 7 的 React、npm 和 JS SDK 项目。PrismUI 保留了大部分 UI Schema、数据域、事件动作和渲染器机制，但 npm 包名、SDK loader、DOM 类名前缀和主题 token 已经切换到 PrismUI 的命名空间。

迁移时应把 `prismui-framework`、`prismui-core`、`prismui-ui` 等包保持在同一版本。不要让 amis 和 PrismUI 分别加载一份 core、UI 或 editor runtime；这样会产生重复的 renderer 注册表、主题上下文或 store。

如果使用编码 Agent 执行迁移，可以安装 [PrismUI Skills](https://github.com/Gengxin-Tech/prismui-skills) 中的 `prismui-migration`：

```bash
npx skills add Gengxin-Tech/prismui-skills --skill prismui-migration
```

## 迁移前盘点

先扫描依赖、入口、深路径、样式选择器和主题变量。下面的命令可以按项目实际目录调整：

```bash
rg -n --glob '!node_modules' \
  "from ['\"]amis|from ['\"]amis-|require\(['\"]amis|amis/lib|amis/es|amisRequire|window\.amis|amis/embed|vite-plugin-amisr" .
rg -n --glob '!node_modules' \
  "\.(amis|cxd|antd|dark)-[A-Za-z0-9_-]+|--(amis|cxd)-[A-Za-z0-9_-]+|classPrefix[=:].*cxd-" .
npm ls amis amis-core amis-ui amis-formula amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime office-viewer vite-plugin-amisr
```

只使用 SDK 的项目还要检查 HTML 中的 `sdk.js`、主题 CSS 和异步资源目录。React 项目还要检查 `package.json`、构建 alias、split chunk 配置、全局样式入口和测试快照。

## 安装依赖

### 包名映射

| amis 包 | PrismUI 包 | 用途 |
| --- | --- | --- |
| `amis` | `prismui-framework` | Schema 渲染器、主入口、SDK 和 schema 文件 |
| `amis-core` | `prismui-core` | 渲染器注册、store、主题和运行时工具 |
| `amis-ui` | `prismui-ui` | 基础 UI 组件、Toast、Alert 等 |
| `amis-formula` | `prismui-formula` | 表达式、过滤器和公式 |
| `office-viewer` | `prismui-office-viewer` | Office 文档预览 |
| `amis-postcss` | `prismui-postcss` | 编辑器样式处理 |
| `i18n-runtime` | `prismui-i18n-runtime` | 多语言运行时 |
| `amis-theme-editor-helper` | `prismui-theme-editor-helper` | 主题编辑器辅助工具 |
| `amis-editor-core` | `prismui-editor-core` | 可视化编辑器核心 |
| `amis-editor` | `prismui-editor` | 可视化编辑器及内置插件 |
| `vite-plugin-amisr` | `vite-plugin-prismui` | Vite Schema 编译插件 |

普通 React 渲染项目：

```bash
npm uninstall amis amis-core amis-ui amis-formula office-viewer
npm install prismui-framework prismui-ui prismui-formula prismui-office-viewer
```

使用编辑器、编辑器主题或 PostCSS 时：

```bash
npm uninstall amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime
npm install prismui-editor prismui-editor-core prismui-theme-editor-helper prismui-postcss prismui-i18n-runtime
```

使用 Vite 插件时：

```bash
npm uninstall vite-plugin-amisr
npm install -D vite-plugin-prismui
```

如果某个旧包只是其他依赖的传递依赖，不要通过强制删除处理；用 `npm ls` 或包管理器的依赖树确认真正的直接依赖，并确保应用运行时只初始化一套 PrismUI runtime。

## React 引入方式

将主入口、主题 CSS、辅助类 CSS 和图标 CSS 一起切换：

```diff
- import 'amis/lib/themes/cxd.css';
- import 'amis/lib/helper.css';
- import 'amis/sdk/iconfont.css';
- import {render as renderAmis} from 'amis';
+ import 'prismui-framework/lib/themes/cxd.css';
+ import 'prismui-framework/lib/helper.css';
+ import 'prismui-framework/sdk/iconfont.css';
+ import {render as renderPrismUI} from 'prismui-framework';
```

`prismui-framework` 会 re-export `prismui-core` 和 `prismui-ui` 的公共入口。直接使用基础组件时改用对应包：

```diff
- import {ToastComponent, AlertComponent} from 'amis-ui';
+ import {ToastComponent, AlertComponent} from 'prismui-ui';
```

渲染函数的参数结构保持不变；React 版本的主题在第三个参数（运行时 options）中传入：

```tsx
import {render} from 'prismui-framework';

export function Preview({theme = 'cxd', schema}: {theme?: string; schema: any}) {
  return render(schema, {}, {theme});
}
```

如果使用 `ToastComponent`、`AlertComponent` 或其他脱离 Schema 的组件，也要给它们传同一个 `theme`，否则它们可能使用默认主题。

### 深路径 import

旧代码中的深路径要按实际归属迁移，不要把所有路径机械地拼成 `prismui-framework`：

```diff
- import type {IRow} from 'amis-core/lib/store/table';
- import type {ColumnSchema} from 'amis/lib/renderers/Table2';
- import {TooltipWrapper} from 'amis-ui/lib/components/TooltipWrapper';
+ import type {IRow} from 'prismui-core/lib/store/table';
+ import type {ColumnSchema} from 'prismui-framework/lib/renderers/Table2';
+ import {TooltipWrapper} from 'prismui-ui/lib/components/TooltipWrapper';
```

优先使用 `prismui-framework`、`prismui-core` 和 `prismui-ui` 的公共导出。确实需要深路径时使用包声明支持的 `lib/*` 路径，并确认目标文件存在；不要直接依赖未导出的构建目录或把 amis 的 `es/*` 路径原样保留。

## JS SDK 引入方式

从 npm 包复制 SDK 文件时，将资源目录改为 `prismui-framework/sdk`：

```diff
- node_modules/amis/sdk/sdk.js
- node_modules/amis/sdk/sdk.css
- node_modules/amis/sdk/iconfont.css
+ node_modules/prismui-framework/sdk/sdk.js
+ node_modules/prismui-framework/sdk/sdk.css
+ node_modules/prismui-framework/sdk/iconfont.css
```

新页面使用 PrismUI loader 和 alias：

```diff
- <script src="./amis/sdk/sdk.js"></script>
+ <script src="./prismui/sdk/sdk.js"></script>
  <script>
-   const amis = amisRequire('amis/embed');
-   amis.embed('#root', schema, props, env);
+   const prismui = prismuiRequire('prismui/embed');
+   prismui.embed('#root', schema, props, env);
  </script>
```

SDK 为历史页面保留了 `window.amis`、`amisRequire` 和 `amis/embed` alias，同时提供 `window.prismuiRequire` 和 `prismui/embed`。兼容入口可以用于分阶段迁移，但新代码应统一使用 PrismUI 命名；不要仅因为运行时仍出现 `amis` 全局变量就删除 SDK 初始化。

SDK 的 `embed` 参数顺序没有改变，`theme` 仍在第四个参数中：

```js
prismui.embed('#root', schema, props, {
  theme: 'dark'
});
```

## API 和方法名

包名改变不等于方法名全部改变。以下公共 API 的方法名和注册生命周期保持不变，只需要从 PrismUI 包引入：

| 能力 | PrismUI API | 推荐入口 |
| --- | --- | --- |
| 普通 renderer | `Renderer`、`registerRenderer`、`unRegisterRenderer` | `prismui-framework` 或 `prismui-core` |
| 表单项 | `FormItem`、`registerFormItem` | `prismui-framework` 或 `prismui-core` |
| 选项控件 | `OptionsControl`、`registerOptionsControl` | `prismui-framework` 或 `prismui-core` |
| 动作、公式和校验 | `registerAction`、`registerFormula`、`addRule`、`registerValidator` | `prismui-framework`/`prismui-core`；`registerValidator` 用 `prismui-editor` |
| 编辑器插件 | `registerEditorPlugin`、`unRegisterEditorPlugin` | `prismui-editor-core` |

例如，自定义 renderer 只改 import，覆盖内置类型时继续显式设置 `override: true`：

```diff
- import {Renderer} from 'amis';
- import {TableStore} from 'amis-core/lib/store/table';
+ import {Renderer} from 'prismui-framework';
+ import {TableStore} from 'prismui-core/lib/store/table';

  @Renderer({
    type: 'table',
    storeType: TableStore.name,
    override: true,
    weight: -200
  })
  export class CustomTable extends BaseTable {}
```

编辑器插件同样保留注册生命周期：

```diff
- import {registerEditorPlugin} from 'amis-editor-core';
+ import {registerEditorPlugin} from 'prismui-editor-core';
  registerEditorPlugin(CustomPlugin);
```

编辑器组件和编辑器样式也要从对应包引入：

```diff
- import {Editor} from 'amis-editor';
- import 'amis-editor-core/lib/style.css';
+ import {Editor} from 'prismui-editor';
+ import 'prismui-editor-core/lib/style.css';
```

注意两组大小写：源码中的 `unRegisterRenderer` 和 `unRegisterEditorPlugin` 是现有导出，不能擅自改成 `unregisterRenderer`；`RendererEditor`、`BasicEditor` 仍是旧版兼容 API，新插件优先继承 `BasePlugin` 并调用 `registerEditorPlugin`。

以下名称属于历史兼容字段，不要为了改品牌而重命名：`type: "amis"`、编辑器的 `amisEnv`、编辑器文档配置中的 `amisDocHost` 以及运行时对象中的 `amisScope`。它们的含义是兼容协议或 schema 类型，不是 npm 入口。

## 样式定制迁移

这是迁移中最重要的 breaking change：PrismUI 默认不再把 `cxd-` 作为组件 DOM 前缀，库主题 CSS 也不生成旧 `.cxd-*` alias。主题文件名仍然可以是 `cxd.css`，但它只是主题包名；组件 DOM 使用稳定的 `.prismui-*` 类名，主题身份使用 `[data-prismui-theme]` 属性表达。

### 1. 迁移组件选择器

把业务样式中指向 amis 组件 DOM 的 `.cxd-*` 和 `.amis-*` 选择器改成 `.prismui-*`：

```diff
- .cxd-Form .cxd-Form-item {
+ .prismui-Form .prismui-Form-item {
    margin-bottom: 12px;
  }

- .cxd-Toast-wrap .cxd-Toast {
+ .prismui-Toast-wrap .prismui-Toast {
    border-radius: 6px;
  }

- .cxd-Button--primary {
+ .prismui-Button--primary {
    min-width: 96px;
  }
```

选择器中的后代类、状态修饰符、伪类和 TypeScript/JSX 中拼接的字符串都要检查。例如 `.cxd-Form-static`、`${prefix}Form-control`、`classPrefix="cxd-"` 不能漏改。只替换代码中确实代表 PrismUI DOM 的类名；第三方组件、业务自定义的 `cxd-*` 类和历史文档链接应人工判断。

组件覆盖代码中硬编码的类名也要同步修改：

```diff
- <div className="cxd-Form-static cxd-Words-field">
+ <div className="prismui-Form-static prismui-Words-field">
```

不要通过 `classPrefix="cxd-"` 恢复旧 DOM。`classPrefix` 已是 deprecated/internal 兼容字段，公共组件类名由 `componentClassPrefix` 驱动并固定为 `prismui-`；删除旧的 `classPrefix` 传参通常就是正确迁移。

主题配置中的 `legacyDomClassAlias: 'cxd'` 只有在应用显式开启时才会生成过渡 alias，官方主题 CSS 默认关闭。它只能用于短期迁移边界，不能作为新业务样式的依赖。

### 2. 迁移 CSS 变量

以前的 `--amis-*` token 需要改成 `--prismui-*`，包括 palette、semantic 和 component 三层：

| amis 变量 | PrismUI 变量 |
| --- | --- |
| `--amis-palette-brand-500` | `--prismui-palette-brand-500` |
| `--amis-color-brand-bg` | `--prismui-color-brand-bg` |
| `--amis-Button-primary-bg` | `--prismui-Button-primary-bg` |
| `--amis-Button-primary-hover-bg` | `--prismui-Button-primary-hover-bg` |

推荐按“基础色板 -> 语义色 -> 组件 token”覆写：

```css
[data-prismui-theme='cxd'] {
  --prismui-palette-brand-500: #2468f2;
  --prismui-color-brand-bg: var(--prismui-palette-brand-500);
  --prismui-Button-primary-bg: var(--prismui-color-brand-bg);
}
```

当前构建产物中仍可看到 `--colors-*`、`--primary`、`--button-*` 等未加前缀的兼容映射。它们不是新的公共 token；已有项目可以暂时依赖，但新增样式和主题配置应使用 `--prismui-*`，并逐项验证旧映射，避免主题升级后失效。

Schema 内的局部 token 可以使用 `cssVars`：

```json
{
  "type": "page",
  "cssVars": {
    "--prismui-palette-brand-500": "#2468f2",
    "--prismui-Button-primary-bg": "var(--prismui-palette-brand-500)"
  },
  "body": "内容"
}
```

### 3. 处理主题作用域和加载顺序

业务覆写应放在 PrismUI 主题 CSS 之后，并优先使用主题属性限制范围：

```css
[data-prismui-theme='dark'] .prismui-Button--primary {
  --prismui-Button-primary-bg: #1677ff;
}
```

主题 CSS 定义了 `prismui.reset`、`prismui.tokens`、`prismui.components`、`prismui.theme` 和 `prismui.user` layers。业务样式可以晚于主题 CSS 加载，或显式放入 `prismui.user` layer：

```css
@layer prismui.user {
  [data-prismui-theme='cxd'] .prismui-Form-item {
    margin-bottom: 12px;
  }
}
```

同一页面有多个 PrismUI 实例时，不要把主题 token 无条件写在 `:root`；使用对应实例上的 `[data-prismui-theme='主题名']`，这样每个实例可以独立切换。

## 主题切换

### SDK

`cxd.css`、`antd.css`、`dark.css` 等是主题文件名，不会生成 `.cxd-*`、`.antd-*` 或 `.dark-*` 组件类。使用某个主题前，先加载对应的 `prismui-framework/sdk` CSS；运行时切换多个主题时，应预先加载所有可能的主题 CSS，再更新 `theme`：

```html
<link rel="stylesheet" href="./prismui/sdk/cxd.css" />
<link rel="stylesheet" href="./prismui/sdk/dark.css" />
<link rel="stylesheet" href="./prismui/sdk/helper.css" />
<script src="./prismui/sdk/sdk.js"></script>
<script>
  const app = prismuiRequire('prismui/embed');
  let scoped = app.embed('#root', schema, {}, {theme: 'cxd'});

  function switchTheme(theme) {
    // 重新传入第四个参数，确保 Schema、Toast、Alert 和 overlay 使用同一主题。
    scoped.unmount();
    scoped = app.embed('#root', schema, {}, {theme});
  }
</script>
```

如果页面只有 Schema 根节点，也可以调用 `scoped.updateProps({theme})` 更新根节点的主题属性；SDK 创建的独立 Toast/Alert 使用 `embed` 的第四个参数，切换这些组件时应按上例重新传入环境参数。

`theme` 会在渲染根节点上设置 `data-prismui-theme`。如果自定义 `getModalContainer`，请让弹窗、Popover、Toast 等 overlay 挂在带有该属性的容器内，否则它们可能拿不到主题 token。

### React

React 中推荐显式传递主题，让页面和脱离 Schema 的组件使用同一个值：

```tsx
import {useState} from 'react';
import {render} from 'prismui-framework';
import {AlertComponent, ToastComponent} from 'prismui-ui';

export function App({schema}: {schema: any}) {
  const [theme, setTheme] = useState('cxd');
  return (
    <div>
      <button onClick={() => setTheme(theme === 'cxd' ? 'dark' : 'cxd')}>
        切换主题
      </button>
      <ToastComponent theme={theme} />
      <AlertComponent theme={theme} />
      {render(schema, {}, {theme})}
    </div>
  );
}
```

`setDefaultTheme('dark')` 可以修改没有显式 `theme` 的后续渲染默认值：

```ts
import {setDefaultTheme} from 'prismui-framework';

setDefaultTheme('dark');
```

页面需要独立主题时优先使用显式传参。手工挂载的组件或 portal 可以使用 `getThemeScopeProps(theme)` 设置 `data-prismui-theme`，或使用 `applyThemeScope` 应用同样的作用域。

IE11 不支持 CSS 变量驱动的动态主题切换。需要兼容 IE11 时，只加载对应的 `*-ie11.css` 静态降级文件，并取消动态切换能力。

## 编辑器、构建和组件覆盖

大型前端基座迁移时，除了源码 import，还要检查以下边界：

### Vite 插件

如果使用 Schema 编译插件，只替换插件包名和变量名；插件选项可以继续保留：

```diff
- import amis from 'vite-plugin-amisr';
+ import prismui from 'vite-plugin-prismui';

  export default {
    plugins: [
-     amis()
+     prismui()
    ]
  };
```

- webpack/Vite alias、externals、splitChunks 分组和按包名匹配 CSS 的正则，全部从 amis 包名改为 PrismUI 包名；不要让 chunk 同时打入 amis 和 PrismUI 的 core/UI。
- 自定义 renderer、FormItem、OptionsControl、action、formula、validator 和 editor plugin 继续使用原注册函数。覆盖内置 renderer 时保留 `override: true`，通过 `weight` 控制优先级。
- 组件库微应用或动态加载器若通过 `__utils__` 接收 `Renderer`、`FormItem`、`OptionsControl`、`addRule`、`registerFormula`、`registerAction`、`registerEditorPlugin` 等函数，只需替换类型和包导入，不要另造一套注册表。
- 编辑器的 `amisEnv`、`amisDocHost` 等兼容字段保持原名；只替换 `amis-editor*`、`amis-theme-editor-helper` 的包导入和深路径。
- SCSS 的变量适配层可以保留组织方式，但其中的 `--amis-*`、`.cxd-*`、`.amis-*` 和旧 `classPrefix` 必须逐项迁移。先迁 token，再迁组件选择器，最后处理组件内部 JSX/TS 字符串。
- overlay、portal、iframe 预览和弹窗容器要验证主题属性是否能沿 DOM 继承；自定义容器必须位于正确的 PrismUI 主题作用域中。

## 迁移后验证

```bash
npm install
npm ls amis amis-core amis-ui amis-formula amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime office-viewer vite-plugin-amisr
rg -n --glob '!node_modules' \
  "from ['\"]amis|from ['\"]amis-|require\(['\"]amis|amis/lib|amis/es|vite-plugin-amisr" src packages examples
rg -n --glob '!node_modules' \
  "\.(amis|cxd)-[A-Za-z0-9_-]+|--(amis|cxd)-[A-Za-z0-9_-]+|classPrefix[=:].*cxd-" src packages examples
npm run typecheck
npm test
```

旧 npm 入口和旧样式前缀在业务代码中应清零；兼容字段 `type: "amis"`、`amisEnv`、SDK 的 `amisRequire` 则按用途逐项确认。浏览器至少验证：

1. 普通 Schema 页面，包括表单提交、校验、Toast 和 Alert。
2. 包含 CRUD、弹窗、Popover、事件动作和自定义 fetcher 的复杂页面。
3. 每个启用的主题，以及主题切换后的 overlay 和 portal。
4. 自定义 renderer、表单项和编辑器插件；编辑器需验证加载、拖拽、属性修改和 `onChange` 回写。

## 常见问题

### 主题文件仍叫 `cxd.css`，是否还要使用 `.cxd-*`？

不需要。`cxd` 是主题名称，组件 DOM 类名统一为 `.prismui-*`，主题作用域统一为 `[data-prismui-theme='cxd']`。

### 旧的 `--colors-*` 或 `--button-*` 变量还能不能用？

它们在当前构建产物中可能作为兼容映射存在，但不是新的公共 token。新增覆写请使用 `--prismui-*`；迁移旧变量时要在每个主题和组件上做视觉回归。

### 为什么迁移后某些自定义样式不生效？

通常是选择器仍使用 `.cxd-*`/`.amis-*`、样式加载早于主题 CSS、覆盖了错误的 portal 容器，或组件 token 没有放在正确的 `[data-prismui-theme]` 作用域内。先在浏览器检查实际 DOM 类名和最近的主题属性，再调整选择器。

### 可以把代码里的所有 `amis` 一次替换成 `prismui` 吗？

不可以。npm 包、import、资源路径和业务变量可以迁移；`type: "amis"`、`amisEnv`、SDK 兼容 loader、历史链接、许可证信息和第三方代码需要按兼容边界人工处理。
