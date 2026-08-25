---
title: 常见问题
---

## 如何水平垂直居中

1.1.5 版本之后可以使用 flex 布局，默认就是水平垂直居中。

## CRUD 顶部有重叠遮挡

在初始化 PrismUI 渲染器的时候设置 `--affix-offset-top` CSS 变量设置成合适的值，或者通过 `"affixHeader": false` 关闭固定顶部功能。

## 如何换行

有时候返回结果中有 `\n`，在页面展现的时候默认不会有换行效果，解决办法有 3 个：

1. 使用 tpl、html、plain 或 static 组件，加上 `"wrapperComponent": "pre"` 配置项
2. 引入 `helper.css`，给组件加上 `"classname": "white-space-pre"` 配置项（预计从 1.1.5 开始内置这个类，从而不需要引入 `helper.css`）
3. 包在 `container` 容器中，使用 `style` 控制样式

前两种方法比较简单，这里就只演示第三种，如果熟悉 css 可以很灵活实现各种展现控制：

```schema
{
  "type": "page",
  "data": {
    "log": "line 1\nline 2"
  },
  "body": {
    "type": "container",
    "style": {
      "white-space": "pre"
    },
    "body": {
      "type": "tpl",
      "tpl": "${log}"
    }
  }
}
```

## 如何折行

折行需要给对应的组件加上 `"classname": "word-break"`。

## 如何实现左侧导航栏页面跳转？

PrismUI 提供了 app 组件，可以基于它实现导航功能。历史上游 admin 示例仍可作为配置思路参考：`https://github.com/aisuda/amis-admin`。

低代码平台类产品也可以基于这套 UI Schema 能力封装更上层的应用搭建体验。

## 集成到 React 项目中报错

一般都是因为 React、Mobx、mobx-react 版本有关，参考 PrismUI 项目的 [package.json](https://github.com/Gengxin-Tech/prismui/blob/master/package.json)，将版本保持一致，尤其是 Mobx，目前 PrismUI 中使用的版本是 4，因为兼容性的考虑短期内不会升级到 5/6，使用 MobX 5/6 肯定会报错。

## 有的功能在官网示例中能用，但在 React/SDK 中无法使用

如果提示找不到渲染器，那肯定是版本较老，尝试以下两种方法解决：

1. 使用最新 beta 版本，方法是去 [npm](https://www.npmjs.com/package/prismui-framework?activeTab=versions) 查看最新版本号，比如当前 beta 版本是 `7.0.0-beta.1`
   ，就运行 `npm i prismui-framework@beta` 命令，在 `node_modules/prismui-framework/sdk` 目录中也能找到对应的 sdk 代码。
2. 如果还是报错，可以使用最新代码自动编译的 sdk，下载地址是 `https://github.com/Gengxin-Tech/prismui/blob/gh-pages/sdk.tar.gz`

## 如何支持配置中的 URL 地址替换？

> 1.5.0 及以上版本

有个常用场景是在开发时使用 `localhost` 地址，而线上使用 `xxx.com`，这时可以使用 `replaceText` 属性，它是第四个参数，也就是 env 参数

```javascript
let prismui = prismuiRequire('prismui/embed');
let prismuiJSON = {
  type: 'page',
  body: {
    type: 'service',
    api: 'HOST/api'
  }
};
let prismuiScoped = prismui.embed(
  '#root',
  prismuiJSON,
  {},
  {
    replaceText: {
      HOST: 'http://localhost'
    }
  }
);
```

## 如何更新全局 data？

使用下面的方式

```
prismuiScoped.updateProps({
  data: {
    xxx: 'yyy'
  }
})
```

## CRUD api 分页功能失效

如果 api 地址中有变量，比如 `/api/mock2/sample/${id}`，PrismUI 就不会自动加上分页参数，需要自己加上，改成 `/api/mock2/sample/${id}?page=${page}&perPage=${perPage}`

## CRUD 性能较慢怎么办？

3.4.1 之后版本有个 `lazyRenderAfter` 配置项，默认是 100，可以改小点，延迟渲染不在屏幕中的行
