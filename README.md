# 我的博客（lay1a.me）

这个仓库是我的个人博客，绑在了 GitHub Pages 上。

这个 README 主要是写给自己看的，防止以后哪天看不懂自己的代码了，还能回来翻翻。顺便记录一下学习过程。

## 拿什么搭的

用了一个叫 [Astro](https://astro.build/) 的框架，版本是 5。纯静态的网页。

语言是 TypeScript，掺着 Astro 自己的文件格式（.astro）。一个 .astro 文件里 HTML、样式、脚本都能写，一篇文章就是一个 markdown 文件。

样式用的就是普通 CSS，分两块：全站的颜色、字体、间距这种变量和通用样式，写在 src/styles/global.css 里；每个组件的样式就写在组件文件自带的 `<style>` 标签里，Astro 会保证它不会影响到别的组件。这些就足够。

## 文件夹里都是啥

- `src/pages/`：一个文件对应一个网址。
  - `index.astro` 是首页；
  - `blog/index.astro` 是"所有文章"列表页；
  - `blog/[slug].astro` 是文章详情页，方括号表示它是动态的，一篇文章生成一个页面。
- `src/components/`：拆开的零件。首页就是几个零件拼起来的：刊头（Navbar）、自我介绍（Hero、About）、项目（Projects、ProjectCard）、最新文章（BlogPreview），最后是页脚（Footer）。还有 Layout，所有页面共同的骨架，比如 head 那些。
- `src/content/`：文章和项目的数据都在这儿，是 markdown 文件。
  - `blog/` 放文章；
  - `projects/` 放项目介绍，首页"我的项目"就是从这里读的。
  - `config.ts` 是这两类文件"说明书"的格式限制，比如说文章必须有标题、日期。
- `src/styles/`：就一个 global.css，是所有样式根，颜色、字体、间距变量都定义在这。
- `src/config.ts`：站点设置，名字、简介、技能列表、社交链接、头像路径都在这改。
- `public/`：不会被构建处理的静态文件，直接原样拷到网站上。头像、favicon、还有 CNAME（域名绑定文件）都在这。
- `.github/workflows/deploy.yml`：自动发布用的工作流，下面详细说。

## 文章怎么发

在 `src/content/blog/` 里新建一个 markdown 文件就完事了。文件名我习惯日期开头加短标题，比如：

```
2026-07-29-fast-power-bitwise-meresenne.md
```

文件开头要写几句"说明书"，英文叫 frontmatter，就是这些：

```
---
title: C++ 快速幂与位运算
date: 2026-07-29
tags:
  - C++
  - 算法
description: 一句话简介，会出现在列表页
draft: false
---
```

`draft` 写 true 的话，本地跑能看见，正式构建的时候会跳过。我有时候写到一半就用这个藏起来。

## 本地跑起来

电脑上装好 Node 就行了（哪个版本的我忘了，18 以上应该都行）：

```
npm install
npm run dev
```

`npm run dev` 是本地开发，改了文件浏览器里马上能看到。

发布前想检查一下，就跑：

```
npm run build
```

它会先检查一遍（astro check），再生成最终的网页，成品在 `dist` 文件夹里。

## 样式和配色

颜色、字体、间距这些都定义在 global.css 最上面的 `:root` 里，是全站的变量。

- `--color-paper` 底色，米白，不是纯白，看着温和一点；
- `--color-ink` 文字，偏墨的颜色，不是纯黑；
- `--color-accent` 强调色，琥珀橙，链接、选中文字、下划线都靠它。

颜色用的是 `oklch()` 这种写法，浏览器新支持的一种颜色格式。我看了一圈说法，说这玩意对人眼的感知更准，而且能防止同行说我紫色渐变用太多，就用它了。想换颜色的话，直接改 `:root` 那几个值，全站都会跟着变。

字体有两种：标题用思源宋体（Noto Serif SC），从 Google Fonts 拉的，想有点报纸书卷气；正文用系统自带的黑体（微软雅黑、苹方这些），主要是懒得让访问者多下载几兆字体。

## 怎么发到网上

有两种方式。

第一种，直接 push。仓库里放了一个 GitHub Actions 工作流（.github/workflows/deploy.yml），只要往 main 分支 push，GitHub 就会自动在它那边装依赖、跑构建、把 dist 发布到 GitHub Pages。等个两分钟左右就能访问。域名的事靠 public/CNAME 文件，里头就一行 `lay1a.me`。

第二种，用我电脑上的一个脚本。`deploy-blog.bat` 放在 D:\cod 那（不在项目目录里，别找错），内容是先构建再 push，双击或者命令行跑一下都行。

两种都行，反正线上始终只有一份最新的。

## 几个备注

- `.opencode/skills/hallmark` 是我装的一个"设计规则"包，给 AI 编程助手用的，专门管着别写出一股 AI 味。之前那版页面被说一眼假、像 AI 模板，后来这就换成现在这套报纸风格了，配色排版思路不少是从它那来的。这个目录已被 .gitignore 排除，不会推上来。
- 头像换过一次：现在用的是我一张游戏截图裁剪出来的（斑马面具那个），放在 public/avatar.jpg。旧的 avatar.svg 还留着，想换回去随时可以。
- 网站目前没有暗色模式、没有评论区、也没有搜索，都是以后再说的计划。
