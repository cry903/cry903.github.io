# 个人主页设计方案

## 概述

将现有 Hexo 博客 `lay1a.me` 改造为「个人主页 + 项目展示 + 博客」一体化站点，使用 Astro 框架重建。

## 用户需求

- 访客打开 lay1a.me 看到一个炫酷的个人主页（不是文章列表）
- 首页包含：头像、自我介绍、技能标签、项目展示卡片、博客入口
- 项目展示区同时展示课程项目和个人项目
- 视觉风格：花哨，有粒子动画、渐入动效、悬停效果
- 博客作为一个独立板块保留，现有 2 篇文章迁移过来
- 部署方式不变（GitHub Pages），域名不变（lay1a.me）

## 技术选型

**Astro** — 最擅长「内容型主页 + 博客」混合站点。静态生成，性能好，支持 Markdown 写作，可嵌入任意 UI 组件。

## 项目结构

```
personal-homepage/
├── src/
│   ├── pages/
│   │   ├── index.astro              # 首页（个人主页）
│   │   ├── blog/
│   │   │   ├── index.astro          # 博客文章列表
│   │   │   └── [slug].astro         # 单篇文章页面
│   │   └── projects/
│   │       └── index.astro          # 所有项目列表（可选独立页）
│   ├── components/
│   │   ├── Navbar.astro             # 顶部导航栏（固定）
│   │   ├── Hero.astro               # 首页 Hero 区（粒子动画背景）
│   │   ├── About.astro              # 个人介绍 + 技能标签
│   │   ├── Projects.astro           # 项目卡片展示区
│   │   ├── BlogPreview.astro        # 首页最新文章入口
│   │   ├── Footer.astro             # 页脚
│   │   └── ProjectCard.astro        # 单个项目卡片组件
│   ├── content/
│   │   ├── blog/                    # 博客文章（Markdown）
│   │   └── projects/                # 项目信息（Markdown + frontmatter）
│   ├── styles/
│   │   └── global.css               # 全局样式
│   └── config.ts                    # 个人信息、技能标签等配置
├── public/
│   ├── avatar.png                   # 头像
│   └── favicon.ico
├── astro.config.mjs
└── package.json
```

## 首页布局

从上到下：

1. **导航栏**（固定在顶部，透明→滚动后带背景）
   - 左侧：Logo/名字
   - 右侧：首页 | 博客 | 关于我
2. **Hero 区**（全屏）
   - 粒子连线动画作为背景（深色底色）
   - 居中：圆形头像 + "Hi, 我是 Layla" + 个人 Slogan
   - 社交链接小图标（GitHub、邮箱）
3. **关于我** → 简短自我介绍段落 + 技能标签云
4. **我的项目** → 3 列卡片网格，每张卡片含名称、简介、技术标签、链接
5. **最新文章** → 展示最近 3 篇博客 + 「查看全部博客 →」链接
6. **页脚** → © 2026 Layla | 由 Astro 驱动

## 视觉特效

- **粒子动画**：Canvas 实现粒子连线网络，位于 Hero 区背景
- **滚动渐入**：各区块滚动进入视口时带淡入 + 上移动画
- **项目卡片悬停**：鼠标悬浮时卡片微微上浮 + 边框发光
- **色彩方案**：深色背景为主（#0a0a0a ~ #1a1a2e），亮色点缀（渐变蓝紫）

## 项目卡片字段

每个项目一个 Markdown 文件，frontmatter 内容：

```yaml
---
name: 项目名称
description: 一句话简介
tags: [C++, Qt, Python]
image: /projects/project1.png  # 可选截图
link: https://github.com/xxx    # 可选链接（GitHub 仓库 / 在线演示 / 下载地址）
---
```

## 博客功能

- 文章存放在 `content/blog/`，Markdown 格式，与 Hexo 写法一致
- 现有 2 篇文章直接迁移，保留原文内容和日期
- 文章列表页按日期倒序排列
- 支持文章内代码高亮

## 部署

- 目标：GitHub Pages，仓库 `cry903.github.io`
- 域名：`lay1a.me`（CNAME 文件保留）
- 方式：GitHub Actions 自动构建部署，推送即上线

## 用户日常操作

| 操作 | 怎么做 |
|------|--------|
| 写新文章 | 在 `content/blog/` 新建 `.md` 文件 |
| 添加项目 | 在 `content/projects/` 新建 `.md` 文件 |
| 修改个人信息 | 编辑 `src/config.ts` |
| 换头像 | 替换 `public/avatar.png` |
| 发布上线 | `git push` |
