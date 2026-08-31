---
title: 介绍
description: 介绍
type: 0
group: 💡 概念
menuName: 介绍
icon:
order: 8
---

## 什么是 PrismUI

PrismUI 是一个低代码前端框架，它使用 JSON 配置来生成页面，可以减少页面开发工作量，极大提升效率。

PrismUI 在 amis 长期实践的基础上独立维护，保留 UI Schema、数据域、事件动作、渲染器、JS SDK 和可视化编辑器等核心能力，并持续演进 npm 包、主题系统、运行时命名空间和工程化接入。已有 amis 项目可以参考[从 amis 迁移到 PrismUI](./start/migration-from-amis)。

## 从 amis 到 PrismUI

PrismUI 优先保持现有 UI Schema 和运行时 API 的兼容，同时逐步完成包名和样式契约的演进。迁移项目时需要重点检查：

- **npm 包**：新项目使用 `prismui-framework`、`prismui-core`、`prismui-ui` 等 `prismui-*` 包名，依赖、深路径 import、构建 alias 和 externals 需要同步调整；
- **DOM 类名**：组件类名使用 `.prismui-*`，业务 CSS 中覆盖 `.cxd-*` 选择器需要迁移；主题文件名中的 `cxd` 仍可能保留，它表示主题名称，不表示组件类名前缀；
- **CSS 变量与主题**：公共 token 使用 `--prismui-*`，自定义样式、portal 和 overlay 需要放在 `[data-prismui-theme='主题名']` 作用域内；
- **SDK 与工程化**：React、JS SDK、编辑器和 Vite 插件使用 PrismUI 对应的入口和资源名称，插件注册生命周期大多保持不变，但包名和样式入口需要切换。

`type: "amis"`、`amisEnv` 等历史协议字段在部分场景仍有兼容意义，不应机械替换。完整的包名映射、样式迁移和主题切换步骤请阅读[从 amis 迁移到 PrismUI](./start/migration-from-amis)。

## 为什么要做 PrismUI？

中后台页面通常同时包含数据获取、筛选、校验、批量操作、分页和权限等交互。若全部使用组件和 JavaScript 手工实现，不仅代码量大，还要长期维护 UI 和交互细节。

PrismUI 用声明式 UI Schema 描述页面结构、数据和行为，让实现方式与底层前端框架解耦。这种声明式的界面构建方式尤其适合 AI 时代：它可以节省上下文，让 AI 专注于业务需求、数据关系和规则，而不是 UI 和交互细节。

例如，下面的配置可以实现一个带筛选、批量操作、列管理、分页和导出的数据页面：

```schema
{
  "title": "浏览器内核对 CSS 的支持情况",
  "remark": "嘿，不保证数据准确性",
  "type": "page",
  "body": {
    "type": "crud",
    "draggable": true,
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "keepItemSelectionOnPageChange": true,
    "autoGenerateFilter": true,
    "bulkActions": [
      {
        "type": "button",
        "label": "批量删除",
        "actionType": "ajax",
        "api": "delete:/api/mock2/sample/${ids|raw}",
        "confirmText": "确定要批量删除?"
      },
      {
        "type": "button",
        "label": "批量修改",
        "actionType": "dialog",
        "dialog": {
          "title": "批量编辑",
          "name": "sample-bulk-edit",
          "body": {
            "type": "form",
            "api": "/api/mock2/sample/bulkUpdate2",
            "body": [
              {
                "type": "hidden",
                "name": "ids"
              },
              {
                "type": "input-text",
                "name": "engine",
                "label": "Engine"
              }
            ]
          }
        }
      }
    ],
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "quickSaveItemApi": "/api/mock2/sample/$id",
    "headerToolbar": [
      "bulkActions",
      {
        "type": "button",
        "label": "重置测试数据",
        "actionType": "ajax",
        "size": "sm",
        "api": "/api/mock2/sample/reset"
      },
      "export-excel",
      {
        "type": "tpl",
        "tpl": "一共有 ${count} 行数据。",
        "className": "v-middle"
      },
      {
        "type": "columns-toggler",
        "align": "right",
        "draggable": true
      },
      {
        "type": "drag-toggler",
        "align": "right"
      }
    ],
    "footerToolbar": ["statistics", "switch-per-page", "pagination"],
    "columns": [
      {
        "name": "id",
        "label": "ID",
        "width": 20,
        "sortable": true,
        "type": "text",
        "searchable": {
          "type": "input-text",
          "name": "id",
          "label": "主键",
          "placeholder": "输入id"
        }
      },
      {
        "name": "browser",
        "label": "Browser",
        "searchable": {
          "type": "select",
          "name": "browser",
          "label": "浏览器",
          "placeholder": "选择浏览器",
          "options": [
            {
              "label": "Internet Explorer ",
              "value": "ie"
            },
            {
              "label": "AOL browser",
              "value": "aol"
            },
            {
              "label": "Firefox",
              "value": "firefox"
            }
          ]
        }
      },
      {
        "name": "platform",
        "label": "平台",
        "popOver": {
          "trigger": "hover",
          "body": {
            "type": "tpl",
            "tpl": "就是为了演示有个叫 popOver 的功能"
          }
        },
        "sortable": true,
        "type": "text"
      },
      {
        "name": "grade",
        "label": "CSS 等级",
        "type": "select",
        "options": ["A", "B", "C", "D", "X"]
      },
      {
        "type": "operation",
        "label": "操作",
        "width": 100,
        "buttons": [
          {
            "type": "button",
            "actionType": "ajax",
            "label": "删除",
            "confirmText": "您确认要删除?",
            "api": "delete:/api/mock2/sample/$id"
          }
        ]
      }
    ]
  }
}
```

这个界面虽然用 `Bootstrap` 及各种前端 UI 库也能做出个大概，但仔细观察会发现它有大量细节功能，比如：

- 可以对数据做筛选
- 有按钮可以刷新数据
- 编辑单行数据
- 批量修改和删除
- 按某列排序
- 可以隐藏某些列
- 可以调整列顺序
- 自动生成顶部查询区域
- 可调整列宽度
- 开启整页内容拖拽排序
- 表格有分页（页数还能同步到地址栏，不过这个例子中关了）
- 有数据汇总
- 支持导出 Excel
- 「渲染引擎」那列的表头有提示文字
- 鼠标移动到「平台」那列的内容时还有放大镜符号，可以展开查看更多
- 如果往下拖动还有首行冻结来方便查看表头（因为文档页面的限制，这个功能在这里看不出来）

全部实现这些需要大量的代码。

但可以看到，用 PrismUI 只需要 **157** 行 JSON 配置（其中 47 行只有一个括号），你不需要了解 `React/Vue`、`Webpack`，甚至不需要很了解 `JavaScript`，即便没学过 PrismUI 也能猜到大部分配置的作用，只需要简单配置就能完成所有页面开发。

这正是建立 PrismUI 的初衷，我们认为：**对于大部分常用页面，应该使用最简单的方法来实现**，甚至不需要学习前端框架和工具。

## 用 JSON 写页面有什么好处

JSON 只是配置的载体，真正重要的是 PrismUI 对 UI Schema 的定义。Schema 是一份描述页面结构、数据和行为的声明式契约：开发者描述“页面要表达什么”和“业务规则是什么”，运行时负责把这些声明落实为组件、状态和交互。相比在代码中按步骤组装界面，这种方式更适合持续维护和规模化协作：

- **声明式表达，降低实现耦合**：页面结构、数据关系和交互规则集中在配置中，不需要重复编写组件创建、状态同步和事件编排代码。底层渲染实现可以持续优化，业务配置保持稳定；
- **规范化语义，减少实现分歧**：组件类型、属性命名、数据映射和事件动作遵循统一 Schema 约定。同一类业务需求可以用一致的结构表达，便于复用模板、比较差异和沉淀团队规范，而不是由每个项目各自发明一套实现；
- **可验证、可审查、可自动化**：Schema 是机器可读的结构化数据，可以在提交和构建阶段执行类型检查、语义校验、版本兼容性检查和格式化。代码评审也能直接聚焦业务字段、权限和接口变化，问题在运行前就能被发现；
- **便于协作和资产复用**：配置可以拆分为组件片段、Definitions 和页面模板，在不同页面和项目间复用。可视化编辑器、代码编辑器、文档工具和构建系统可以围绕同一份 Schema 协同工作，避免设计稿、实现代码和线上行为长期偏离；
- **适合 AI 协作**：声明式、规范化的结构用更少的上下文表达完整页面，AI 可以直接理解组件、数据和规则，把上下文和推理集中在业务需求上，而不是反复生成 UI 和交互细节；
- **平滑演进，降低长期维护成本**：页面配置与 React、Vue、打包工具等具体实现解耦。运行时可以通过升级组件能力、性能和可访问性来改善页面，已有业务 Schema 通常不需要重写；
- **不要求使用者掌握完整前端栈**：PrismUI 将常见后台页面的交互模式和工程经验沉淀为组件与 Schema，使用者可以从配置入手，按需通过 React 和扩展 API 处理特殊场景。

因此，使用 JSON 并不是把页面代码换成另一种文本格式，而是用统一的 UI Schema 建立一套可理解、可验证、可复用、可演进的界面描述方式。你可以完全使用[可视化页面编辑器](../editor)制作页面，也可以在代码中管理 Schema；两种方式使用同一套运行时契约，产物都可以直接上线。

## PrismUI 的发展方向

PrismUI 会在保持 Schema 兼容和运行时稳定的基础上持续演进：

- **AI 友好的文档与 Skills 集**：提供结构稳定、可检索、带上下文和示例的文档，并将界面布局模式提炼、项目集成、组件扩展、迁移和问题排查等常见工作流沉淀为 Skills，让 AI 能按 PrismUI 约定生成并验证配置；
- **Schema 验证与语义规范**：增强静态检查、类型推断、版本兼容性检查和错误定位，在编辑器、构建工具和运行时提供一致诊断。坚持语义优先，现有属性经过评审，新增属性遵循定义先行，先明确语义、边界、默认行为和兼容策略；
- **组件与扩展能力**：持续增强各组件能力，优先完善 Table 的列管理、单元格编辑、虚拟滚动、批量操作和大数据量渲染，同时开放 renderer、表单校验、数据适配、主题、弹层容器和编辑器插件等稳定扩展点；
- **主题、可访问性与工程化**：继续推进 `prismui-*` 主题 token、作用域主题、明暗模式、响应式布局、可访问性、SDK 资源加载和 React/Vite 接入，降低业务定制和升级成本；
- **编辑器与生态**：提升可视化编辑器的配置能力、预览一致性和插件机制，通过示例、迁移指南和社区 Skills 降低接入与升级成本。

这些方向不会改变 PrismUI 的基本定位：用 UI Schema 解决大多数企业应用页面，同时保留在必要场景下使用 React 和扩展 API 的自由度。

## PrismUI 的其它亮点

- **提供完整的界面解决方案**：其它 UI 框架必须使用 JavaScript 来组装业务逻辑，而 PrismUI 只需 JSON 配置就能完成完整功能开发，包括数据获取、表单提交及验证等功能，做出来的页面不需要经过二次开发就能直接上线；
- **大量内置组件（120+），一站式解决**：其它 UI 框架大部分都只有最通用的组件，如果遇到一些稍微不常用的组件就得自己找第三方，而这些第三方组件往往在展现和交互上不一致，整合起来效果不好，而 PrismUI 则内置大量组件，包括了富文本编辑器、代码编辑器、diff、条件组合、实时日志等业务组件，绝大部分中后台页面开发只需要了解 PrismUI 就足够了；
- **支持扩展**：除了低代码模式，还可以通过 [自定义组件](./extend/internal) 来扩充组件，实际上 PrismUI 可以当成普通 UI 库来使用，实现 90% 低代码，10% 代码开发的混合模式，既提升了效率，又不失灵活性；
- **容器支持无限级嵌套**：可以通过嵌套来满足各种布局及展现需求；
- **经历了长时间的实战考验**：PrismUI 继承了原项目长期打磨出的业务场景经验，从内容审核到机器管理，从数据分析到模型训练，都能覆盖复杂后台页面需求，最复杂的页面可由超过 1 万行 JSON 配置承载。

## PrismUI 不适合做什么？

使用 JSON 有优点但也有明显缺点，在以下场合并不适合 PrismUI：

- **大量定制 UI**：JSON 配置使得 PrismUI 更适合做有大量常见 UI 组件的页面，但对于面向普通客户（toC）的页面，往往追求个性化的视觉效果，这种情况下用 PrismUI 就不合适，实际上绝大部分前端 UI 组件库也都不适合，只能定制开发。
- **极为复杂或特殊的交互**：
  - 有些复杂的前端功能，比如 可视化编辑器，其中有大量定制的拖拽操作，这种需要依赖原生 DOM 实现的功能无法使用 PrismUI。
  - 但对于某些交互固定的领域，比如图连线，PrismUI 后续会有专门的组件来实现。

## 阅读建议

- 如果你是第一次接触 PrismUI，那么请 **务必认真阅读完概念部分**，它会让你对 PrismUI 有个整体的认识
- 如果你已经掌握 PrismUI 基本概念，且有一定的开发经验，需要参考 PrismUI 组件相关文档的同学，那么请移步 [组件文档](../components/page)

## 让我们马上开始吧

点击页面底部的下一篇，继续阅读文档。
