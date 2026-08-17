amis.define('docs/zh-CN/style/css-vars.md', function(require, exports, module, define) {

  module.exports = {
    "title": "CSS 变量",
    "html": "<div class=\"markdown-body\"><p>目前示例中包含了一个<a href=\"../../examples/theme\">主题编辑器</a>，可以在线实时预览效果。</p>\n<p>amis 的主题变量主路径使用 <code>--prismui-*</code> 命名。旧变量仍可能作为兼容 alias 存在，但新主题和新业务覆写应优先使用 <code>--prismui-*</code>。</p>\n<h2><a class=\"anchor\" name=\"token-%E5%88%86%E5%B1%82\" href=\"#token-%E5%88%86%E5%B1%82\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Token 分层</h2><table>\n<thead>\n<tr>\n<th>层级</th>\n<th>示例</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>palette</td>\n<td><code>--prismui-palette-brand-500</code></td>\n<td>原始色板值，适合定义主题基础色。</td>\n</tr>\n<tr>\n<td>semantic</td>\n<td><code>--prismui-color-brand-bg</code></td>\n<td>语义化颜色，适合表达品牌、文本、边框等通用语义。</td>\n</tr>\n<tr>\n<td>component</td>\n<td><code>--prismui-Button-primary-bg</code></td>\n<td>组件级 token，适合精确调整某个组件状态。</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%B8%B8%E7%94%A8%E5%8F%98%E9%87%8F\" href=\"#%E5%B8%B8%E7%94%A8%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>常用变量</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>--prismui-palette-brand-400</code></td>\n<td>颜色</td>\n<td>品牌色浅态。</td>\n</tr>\n<tr>\n<td><code>--prismui-palette-brand-500</code></td>\n<td>颜色</td>\n<td>品牌主色。</td>\n</tr>\n<tr>\n<td><code>--prismui-palette-brand-600</code></td>\n<td>颜色</td>\n<td>品牌色深态。</td>\n</tr>\n<tr>\n<td><code>--prismui-palette-neutral-text-inverse</code></td>\n<td>颜色</td>\n<td>反色文字。</td>\n</tr>\n<tr>\n<td><code>--prismui-color-brand-bg</code></td>\n<td>颜色</td>\n<td>品牌背景色，默认引用品牌主色。</td>\n</tr>\n<tr>\n<td><code>--prismui-color-brand-hover-bg</code></td>\n<td>颜色</td>\n<td>品牌 hover 背景色。</td>\n</tr>\n<tr>\n<td><code>--prismui-color-brand-active-bg</code></td>\n<td>颜色</td>\n<td>品牌 active 背景色。</td>\n</tr>\n<tr>\n<td><code>--prismui-color-brand-border</code></td>\n<td>颜色</td>\n<td>品牌边框色。</td>\n</tr>\n<tr>\n<td><code>--prismui-color-text-inverse</code></td>\n<td>颜色</td>\n<td>反色文字语义。</td>\n</tr>\n<tr>\n<td><code>--prismui-Button-primary-bg</code></td>\n<td>颜色</td>\n<td>主按钮背景色。</td>\n</tr>\n<tr>\n<td><code>--prismui-Button-primary-hover-bg</code></td>\n<td>颜色</td>\n<td>主按钮 hover 背景色。</td>\n</tr>\n<tr>\n<td><code>--prismui-Button-primary-active-bg</code></td>\n<td>颜色</td>\n<td>主按钮 active 背景色。</td>\n</tr>\n<tr>\n<td><code>--prismui-Button-primary-border-color</code></td>\n<td>颜色</td>\n<td>主按钮边框色。</td>\n</tr>\n<tr>\n<td><code>--prismui-Button-primary-color</code></td>\n<td>颜色</td>\n<td>主按钮文字色。</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E8%A6%86%E5%86%99%E7%A4%BA%E4%BE%8B\" href=\"#%E8%A6%86%E5%86%99%E7%A4%BA%E4%BE%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>覆写示例</h2><!--prismui-preview-start--><div class=\"prismui-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"cssVars\": {\n    \"--prismui-palette-brand-500\": \"#CD3632\",\n    \"--prismui-color-brand-bg\": \"var(--prismui-palette-brand-500)\",\n    \"--prismui-Button-primary-bg\": \"var(--prismui-color-brand-bg)\"\n  },\n  \"body\": \"内容\"\n}\n</script></div><!--prismui-preview-end-->\n<p>如果只想对某个主题生效，可以在业务 CSS 中加主题作用域：</p>\n<pre><code class=\"language-css\"><span class=\"token selector\">[data-prismui-theme='custom']</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">--prismui-palette-brand-500</span><span class=\"token punctuation\">:</span> #CD3632<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">--prismui-Button-primary-bg</span><span class=\"token punctuation\">:</span> <span class=\"token function\">var</span><span class=\"token punctuation\">(</span>--prismui-palette-brand-500<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<h2><a class=\"anchor\" name=\"%E5%85%BC%E5%AE%B9%E8%AF%B4%E6%98%8E\" href=\"#%E5%85%BC%E5%AE%B9%E8%AF%B4%E6%98%8E\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>兼容说明</h2><p>旧变量名如 <code>--primary</code>、<code>--button-color</code> 仍可能由兼容层映射到新的 token，但它们不再是新增主题能力的推荐入口。新文档、新主题包和新业务覆写应优先使用 <code>--prismui-*</code>。</p>\n<p>IE11 不支持 CSS 变量动态切换主题；如果需要 IE11，只能使用对应的静态 CSS 降级文件。</p>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Token 分层",
          "fragment": "token-%E5%88%86%E5%B1%82",
          "fullPath": "#token-%E5%88%86%E5%B1%82",
          "level": 2
        },
        {
          "label": "常用变量",
          "fragment": "%E5%B8%B8%E7%94%A8%E5%8F%98%E9%87%8F",
          "fullPath": "#%E5%B8%B8%E7%94%A8%E5%8F%98%E9%87%8F",
          "level": 2
        },
        {
          "label": "覆写示例",
          "fragment": "%E8%A6%86%E5%86%99%E7%A4%BA%E4%BE%8B",
          "fullPath": "#%E8%A6%86%E5%86%99%E7%A4%BA%E4%BE%8B",
          "level": 2
        },
        {
          "label": "兼容说明",
          "fragment": "%E5%85%BC%E5%AE%B9%E8%AF%B4%E6%98%8E",
          "fullPath": "#%E5%85%BC%E5%AE%B9%E8%AF%B4%E6%98%8E",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
