---
title: PrismUI 项目说明
description: 了解 PrismUI 与 amis 的关系、主要变化、兼容边界和未来发展方向。
---

## PrismUI 是什么

PrismUI 是在 amis 基础上独立维护和持续演进的 UI Schema 驱动前端框架。它保留了 UI Schema、数据域、事件动作、渲染器、JS SDK 和可视化编辑器等核心能力，同时针对包发布、主题系统、运行时命名空间和工程化接入进行了独立建设。

PrismUI 不是 baidu/amis 的官方发布渠道。上游项目的版权和许可声明继续保留，PrismUI 的代码、文档和发布节奏由 PrismUI 社区独立维护。

## 主要变化

从 amis 迁移到 PrismUI 时，最需要关注以下变化：

| 领域 | PrismUI 现状 | 对项目的影响 |
| --- | --- | --- |
| npm 包 | 使用 `prismui-framework`、`prismui-core`、`prismui-ui` 等 `prismui-*` 包名 | 依赖、深路径 import、构建 alias 和 externals 需要同步调整 |
| React 入口 | 从 `prismui-framework` 引入渲染器，从 `prismui-ui` 引入基础 UI 组件 | UI Schema 通常不需要因为包名变化而重写 |
| JS SDK | 新代码使用 `prismuiRequire('prismui/embed')` 和 `prismui-framework/sdk` 资源 | 旧的 `window.amis`、`amisRequire` 等标识可能继续作为兼容入口存在 |
| DOM 类名 | 组件类名使用 `.prismui-*` | 业务 CSS 中的 `.cxd-*`、`.amis-*` 选择器需要逐项迁移 |
| CSS token | 公共变量使用 `--prismui-*` | 旧的 `--amis-*` 或未加前缀变量不应作为新代码的公共契约 |
| 主题作用域 | 使用 `[data-prismui-theme='主题名']` | 自定义样式、portal 和 overlay 要放在正确的主题作用域内 |
| 编辑器和构建插件 | 编辑器使用 `prismui-editor*`，Vite 插件使用 `vite-plugin-prismui` | 插件注册生命周期大多保持不变，但包名和样式入口需要切换 |

主题文件名仍可能是 `cxd.css`。这里的 `cxd` 表示主题，不表示组件 DOM 前缀；不要通过 `classPrefix="cxd-"` 恢复旧类名。

## 兼容边界

PrismUI 优先保持已有 UI Schema、数据域、事件动作和渲染器 API 的兼容。`type: "amis"`、`amisEnv`、`amisDocHost` 等名称在部分场景中属于历史协议字段，不能仅因为品牌更名就机械替换。

以下内容需要在迁移项目中单独验证：

- 依赖树中是否同时加载了 amis 和 PrismUI 的 core、UI 或 editor runtime；
- 自定义 renderer、FormItem、OptionsControl、action、formula、validator 和 editor plugin 是否仍通过官方注册表注册；
- 主题 CSS、组件选择器、CSS 变量和自定义 portal 容器是否命中实际的 PrismUI DOM；
- SDK、弹窗、Popover、Toast、iframe 预览和多实例页面是否处在同一个主题作用域；
- 构建工具的 alias、externals、分包规则和 CSS 资源路径是否已经完成包名迁移。

完整的包名映射、样式迁移、主题切换和验证步骤请阅读[从 amis 迁移到 PrismUI](./migration-from-amis)。

## 使用建议

新项目可以从[快速开始](./getting-started)开始，选择 React 或 JS SDK 接入方式。已经使用 amis 的项目建议先盘点依赖、入口和样式覆盖，再按迁移指南分阶段切换；不要一次性替换所有包含 `amis` 的文本，因为兼容字段、历史链接和第三方代码可能仍然需要保留。

如果使用编码 Agent 辅助迁移，可以安装 [PrismUI Skills](https://github.com/Gengxin-Tech/prismui-skills) 中的 `prismui-migration`：

```bash
npx skills add Gengxin-Tech/prismui-skills --skill prismui-migration
```

## 发展方向

PrismUI 后续会围绕以下方向持续演进：

1. **运行时和 Schema 稳定性**：继续兼容已有页面配置，减少升级时的行为变化，并完善 renderer、数据域和事件动作的契约测试。
2. **组件与扩展能力**：完善基础组件、表单控件、编辑器插件和自定义 renderer 的公共接口，让低代码配置和代码扩展可以在同一套运行时中协作。
3. **主题与可访问性**：继续推进 `prismui-*` 主题 token、作用域主题、明暗模式、响应式布局和可访问性支持，降低业务覆盖样式的维护成本。
4. **SDK 与工程化**：优化 JS SDK 的资源加载、React/Vite 接入、构建产物和版本管理，支持从简单页面嵌入到大型前端工程的渐进式使用。
5. **编辑器和生态**：提升可视化编辑器的配置能力、预览一致性和扩展机制，并通过示例、迁移指南和 Agent Skills 降低接入与升级成本。

这些方向不会改变 PrismUI 的基本定位：用 UI Schema 解决大多数企业应用页面，同时保留在必要场景下使用 React 和扩展 API 的自由度。
