---
title: 从 amis 迁移到 PrismUI
description: 将已有 amis 项目迁移到 PrismUI 的包名、入口、样式和编辑器接入指南。
---

本文面向已经在项目中使用 amis 的开发者，说明如何把 npm 依赖、代码入口、样式资源和可视化编辑器迁移到 PrismUI。

PrismUI 是基于 amis fork 后独立维护的版本。迁移的重点是切换包名和品牌入口；已有 UI Schema 的大部分组件类型、属性、事件动作和数据域机制会尽量保持兼容。

## 迁移前确认

迁移前先做一次依赖和代码盘点，确认项目里实际使用了哪些入口：

```bash
rg "from ['\"]amis|from ['\"]amis-|amisRequire|window\.amis|amis/embed|amis/lib|amis-ui|amis-core|amis-editor|vite-plugin-amisr" .
npm ls amis amis-core amis-ui amis-formula amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime office-viewer vite-plugin-amisr
```

如果你的项目只通过 JS SDK 加载 `sdk.js`，重点检查 HTML 中的资源路径和 SDK loader。  
如果你的项目通过 React/npm 集成，重点检查 `package.json`、源码 import、样式 import、构建插件和编辑器依赖。

## 包名替换表

PrismUI 7 的正式包使用无 scope 包名，可以直接安装 `latest`。

| amis 包名                  | PrismUI 包名                  | 说明                                       |
| -------------------------- | ----------------------------- | ------------------------------------------ |
| `amis`                     | `prismui-framework`           | UI Schema 渲染器、SDK、schema 产物和主入口 |
| `amis-core`                | `prismui-core`                | 核心运行时能力                             |
| `amis-ui`                  | `prismui-ui`                  | 基础 UI 组件和主题样式                     |
| `amis-formula`             | `prismui-formula`             | 表达式和公式能力                           |
| `office-viewer`            | `prismui-office-viewer`       | Office 文档预览能力                        |
| `amis-postcss`             | `prismui-postcss`             | 编辑器样式处理运行时                       |
| `i18n-runtime`             | `prismui-i18n-runtime`        | 多语言运行时                               |
| `amis-theme-editor-helper` | `prismui-theme-editor-helper` | 主题编辑器辅助能力                         |
| `amis-editor-core`         | `prismui-editor-core`         | 可视化编辑器核心                           |
| `amis-editor`              | `prismui-editor`              | PrismUI 内置渲染器的编辑器插件集合         |
| `vite-plugin-amisr`        | `vite-plugin-prismui`         | JSON schema 转 React 组件的 Vite 插件      |

常见 React 渲染场景至少需要：

```bash
npm uninstall amis amis-core amis-ui amis-formula office-viewer
npm install prismui-framework prismui-ui
```

如果你使用可视化编辑器：

```bash
npm uninstall amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime
npm install prismui-editor prismui-editor-core prismui-theme-editor-helper prismui-postcss prismui-i18n-runtime
```

如果你使用 Vite 插件：

```bash
npm uninstall vite-plugin-amisr
npm install -D vite-plugin-prismui
```

## React 项目迁移

把渲染器入口从 amis 切到 PrismUI：

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

如果项目直接使用 UI 组件，也同步替换：

```diff
- import {ToastComponent, AlertComponent} from 'amis-ui';
+ import {ToastComponent, AlertComponent} from 'prismui-ui';
```

渲染调用本身通常不需要改 UI Schema：

```diff
- renderAmis(schema, props, env);
+ renderPrismUI(schema, props, env);
```

建议把业务代码里的变量名也改成 `prismui` / `renderPrismUI`，这样后续排查时不会把品牌入口和兼容接口混在一起。

## JS SDK 迁移

如果你从 npm 包中拷贝 SDK 文件，把路径切到 `prismui-framework/sdk`：

```diff
- node_modules/amis/sdk/sdk.js
- node_modules/amis/sdk/sdk.css
- node_modules/amis/sdk/iconfont.css
+ node_modules/prismui-framework/sdk/sdk.js
+ node_modules/prismui-framework/sdk/sdk.css
+ node_modules/prismui-framework/sdk/iconfont.css
```

HTML 中优先使用 PrismUI loader：

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

SDK 为了承接历史页面，仍可能保留 `window.amis` / `amisRequire` 等兼容标识。新代码建议统一使用 `prismuiRequire('prismui/embed')`，但不要因为看到兼容标识就盲目删除运行时代码。

## 可视化编辑器迁移

编辑器包名和渲染器入口都要切换：

```diff
- import {Editor} from 'amis-editor';
- import {Renderer} from 'amis';
+ import {Editor} from 'prismui-editor';
+ import {Renderer} from 'prismui-framework';
```

如果代码中使用了编辑器核心或主题辅助包，也按包名替换表同步迁移：

```diff
- import {BasePlugin} from 'amis-editor';
- import {EditorManager} from 'amis-editor-core';
+ import {BasePlugin} from 'prismui-editor';
+ import {EditorManager} from 'prismui-editor-core';
```

编辑器属性中历史字段名可能仍叫 `amisEnv`，这是兼容 API，不需要为了改品牌而重命名业务传参；如果未来 PrismUI 提供新的字段名，再按对应版本的说明迁移。

## 样式和主题迁移

样式文件路径需要从 `amis` 切到 `prismui-framework`：

```diff
- import 'amis/lib/themes/cxd.css';
- import 'amis/lib/helper.css';
+ import 'prismui-framework/lib/themes/cxd.css';
+ import 'prismui-framework/lib/helper.css';
```

新主题变量优先使用 `--prismui-*`。历史 `--amis-*` 变量可能仍作为兼容 alias 存在，但新业务覆写建议逐步迁移到 PrismUI 命名。

DOM class 前缀默认已经切到 `.prismui-*`。如果你的业务 CSS 写了大量 `.amis-*` 选择器，需要逐条确认是否仍命中目标节点，不建议一次性全局替换所有文本，因为文档、历史注释、兼容组件类型和第三方说明中仍可能合理出现 `amis`。

## UI Schema 兼容注意点

大多数页面 schema 不需要改。下面这些场景需要人工确认：

- 顶层组件、表单、CRUD、事件动作、表达式和模板语法通常保持兼容。
- `type: "amis"` 是历史嵌套渲染器组件的兼容类型名，在 PrismUI 中仍用于承接历史 UI Schema，不要直接改成 `type: "prismui"`。
- schema 中如果有自定义 `className`、`wrapperComponent`、`onEvent`、`env` 适配器或 `fetcher`，迁移后需要做页面级 smoke test。
- 如果代码依赖包内部深路径，例如 `amis/lib/...`、`amis/es/...`，必须改到对应的 `prismui-framework/lib/...` 或 `prismui-framework/esm/...`，并确认目标文件仍存在。

## Vite 插件迁移

如果项目使用 `vite-plugin-amisr`，改成 `vite-plugin-prismui`：

```diff
- import amis from 'vite-plugin-amisr';
+ import prismui from 'vite-plugin-prismui';

export default {
  plugins: [
-   amis()
+   prismui()
  ]
};
```

插件选项如果只是 schema 编译配置，通常可以原样保留；如果选项里写死了输出文件名、全局变量名或自定义路径，请按项目约定同步改名。

## 迁移后验证

完成替换后建议至少跑下面几项：

```bash
npm install
npm ls amis amis-core amis-ui amis-formula amis-editor amis-editor-core amis-theme-editor-helper amis-postcss i18n-runtime office-viewer vite-plugin-amisr
rg "from ['\"]amis|from ['\"]amis-|amis/lib|amis/es|amis-ui|amis-core|amis-editor|vite-plugin-amisr" src packages examples
rg "amisRequire|window\.amis|type: ['\"]amis|\"type\": \"amis\"" src packages examples
npm run typecheck
npm test
```

第二个 `rg` 用来找旧 npm 入口；第三个 `rg` 用来找 SDK 或 schema 兼容入口。前者应该清零，后者需要逐项判断是否是合理兼容用法。

最后在浏览器里验证至少三个页面：

1. 一个普通 schema 渲染页面，确认主题、表单提交和 toast/alert 正常。
2. 一个包含 CRUD、弹窗、事件动作或自定义 fetcher 的复杂页面。
3. 如果使用编辑器，再验证编辑器可以加载 schema、拖入组件、修改属性并回写 `onChange`。

## 常见问题

### 迁移后还能看到 amis 字样，是不是没改干净？

不一定。PrismUI 源自 amis，源码、文档、兼容 API、历史 schema 类型或第三方链接中可能保留必要的 `amis` 字样。判断标准是：运行时依赖和新业务入口不再引用旧 npm 包；兼容 API 或历史说明可以保留。

### 应该安装 `@beta` 还是不带 tag？

正式版发布后，业务项目建议直接安装不带 tag 的 `latest` 版本：

```bash
npm install prismui-framework prismui-ui
```

只有在验证指定预发布版本时，才使用 `@beta` 或明确的 prerelease 版本号。

### 能不能一次性全局替换 `amis` 为 `prismui`？

不建议。包名、import、样式路径和品牌文案可以批量替换；兼容类型名、历史链接、许可证 attribution、SDK 兼容 loader、注释和第三方示例需要人工判断。
