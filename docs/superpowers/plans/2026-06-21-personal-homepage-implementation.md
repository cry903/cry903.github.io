# 个人主页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Hexo 博客迁移到 Astro，构建带粒子动画、项目展示和博客的个人主页，部署到 lay1a.me

**Architecture:** Astro 静态站点，首页由多个组件（Hero/About/Projects/BlogPreview）纵向拼接，博客和项目使用 Content Collections，通过 GitHub Actions 部署到 GitHub Pages

**Tech Stack:** Astro 5, TypeScript, Canvas API (粒子动画), CSS Custom Properties + Intersection Observer (滚动动画), GitHub Actions

## Global Constraints

- 项目根目录：`D:/Blog`
- 域名：`lay1a.me`（CNAME 保留）
- 部署目标：`cry903.github.io`，分支 `main`
- 色彩方案：深色背景 `#0a0a0a`，卡片背景 `#1a1a2e`，亮色点缀渐变蓝紫
- 个人信息：作者名 Layla，副标题"沟水相逢，尽是他乡之客"

---

## File Structure Map

```
D:/Blog/
├── public/
│   ├── CNAME                  # [已有] 域名配置
│   ├── avatar.png             # [待添加] 头像图片
│   └── favicon.svg            # [新建] 网站图标
├── src/
│   ├── config.ts              # [新建] 个人信息配置
│   ├── content/
│   │   ├── blog/              # [新建] 博客文章 md
│   │   │   ├── 2026-03-18-first-post.md
│   │   │   └── 2026-05-27-test.md
│   │   ├── projects/          # [新建] 项目展示 md
│   │   │   └── course-design.md
│   │   └── config.ts          # [新建] Content collection schemas
│   ├── components/
│   │   ├── Layout.astro       # [新建] 页面外壳
│   │   ├── Navbar.astro       # [新建] 导航栏
│   │   ├── Footer.astro       # [新建] 页脚
│   │   ├── Hero.astro         # [新建] Hero 区 + 粒子动画
│   │   ├── About.astro        # [新建] 关于我 + 技能标签
│   │   ├── Projects.astro     # [新建] 项目区（取数据 + 网格布局）
│   │   ├── ProjectCard.astro  # [新建] 单张项目卡片
│   │   └── BlogPreview.astro  # [新建] 首页最新文章
│   ├── pages/
│   │   ├── index.astro        # [新建] 首页（组装所有组件）
│   │   └── blog/
│   │       ├── index.astro    # [新建] 博客文章列表页
│   │       └── [slug].astro   # [新建] 单篇文章详情页
│   └── styles/
│       └── global.css         # [新建] 全局样式 + CSS 变量
├── astro.config.mjs           # [新建] Astro 配置
├── package.json               # [新建] 项目依赖
├── tsconfig.json              # [新建] TypeScript 配置
└── .github/
    └── workflows/
        └── deploy.yml         # [新建] GitHub Actions 部署
```

---

### Task 1: 创建 Astro 项目骨架

**Files:**
- Create: `D:/Blog/package.json`
- Create: `D:/Blog/astro.config.mjs`
- Create: `D:/Blog/tsconfig.json`
- Create: `D:/Blog/src/styles/global.css`

**Interfaces:**
- Produces: `astro.config.mjs` 导出 Astro 配置（site: https://lay1a.me, output: static）

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "lay1a-homepage",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: 创建 astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lay1a.me',
  output: 'static',
  trailingSlash: 'always',
});
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: 创建全局样式文件 `src/styles/global.css`**

```css
/* ===== CSS Custom Properties ===== */
:root {
  --color-bg: #0a0a0a;
  --color-surface: #1a1a2e;
  --color-surface-hover: #222240;
  --color-primary: #6c63ff;
  --color-primary-light: #8b83ff;
  --color-accent: #00d4ff;
  --color-text: #e0e0e0;
  --color-text-muted: #888;
  --color-border: rgba(255, 255, 255, 0.08);
  --font-mono: 'Fira Code', 'Consolas', monospace;
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --max-width: 1100px;
  --nav-height: 64px;
  --radius: 12px;
  --transition: 0.3s ease;
}

/* ===== Reset & Base ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height);
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a {
  color: var(--color-primary-light);
  text-decoration: none;
  transition: color var(--transition);
}

a:hover {
  color: var(--color-accent);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* ===== Utility: Section Container ===== */
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== Scroll Reveal Animation ===== */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

/* ===== Code Block Styling ===== */
pre {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px !important;
  overflow-x: auto;
  font-size: 0.9rem;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

:not(pre) > code {
  background: var(--color-surface);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-accent);
}
```

- [ ] **Step 5: 安装依赖**

```bash
cd D:/Blog && npm install
```

- [ ] **Step 6: 确保 `public/CNAME` 文件存在**

```bash
# CNAME 文件已在 D:/Blog/public/ 下，确认内容为 lay1a.me
```

如果 `public/` 目录不存在则创建，把 `D:/Blog/CNAME` 移动到 `D:/Blog/public/CNAME`。

- [ ] **Step 7: Commit**

```bash
cd D:/Blog
git init
git add package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css public/CNAME
git commit -m "feat: scaffold Astro project with base styles"
```

---

### Task 2: 个人配置 + Content Collections 定义

**Files:**
- Create: `D:/Blog/src/config.ts`
- Create: `D:/Blog/src/content/config.ts`

**Interfaces:**
- Produces: `src/config.ts` export: `SITE_CONFIG` (name, subtitle, bio, skills, social), `SKILLS` (string[]), `SOCIAL_LINKS` ({label, url, icon}[])
- Produces: `src/content/config.ts` 定义 `blog` 和 `projects` 两个 collection 的 zod schema

- [ ] **Step 1: 创建 `src/config.ts`**

```ts
export const SITE_CONFIG = {
  name: 'Layla',
  fullName: 'Layla',
  subtitle: '沟水相逢，尽是他乡之客',
  bio: '热爱技术与创作，记录学习路上的点点滴滴。欢迎来到我的个人主页！',
  avatar: '/avatar.png',
} as const;

export const SKILLS: string[] = [
  'C++',
  'Python',
  'Qt',
  'OpenCV',
  'HTML/CSS',
  'Git',
];

export const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/cry903',
    icon: 'github',
  },
  {
    label: 'Email',
    url: 'mailto:layla@lay1a.me',
    icon: 'email',
  },
] as const;
```

- [ ] **Step 2: 创建 `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    link: z.string().optional(),
    linkText: z.string().default('查看项目'),
    featured: z.boolean().default(true),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
```

- [ ] **Step 3: Commit**

```bash
cd D:/Blog
git add src/config.ts src/content/config.ts
git commit -m "feat: add site config and content collection schemas"
```

---

### Task 3: Layout 基础组件

**Files:**
- Create: `D:/Blog/src/components/Layout.astro`

**Interfaces:**
- Consumes: `SITE_CONFIG` from `src/config.ts`
- Produces: `<Layout>` component — 包裹所有页面的 HTML 外壳，接收 `title` prop

- [ ] **Step 1: 创建 `src/components/Layout.astro`**

```astro
---
import { SITE_CONFIG } from '../config';
import '../styles/global.css';

interface Props {
  title?: string;
}

const { title } = Astro.props;

const pageTitle = title
  ? `${title} | ${SITE_CONFIG.name}`
  : `${SITE_CONFIG.name} — ${SITE_CONFIG.subtitle}`;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={SITE_CONFIG.bio} />
    <meta name="author" content={SITE_CONFIG.name} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={SITE_CONFIG.bio} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{pageTitle}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/Layout.astro
git commit -m "feat: add Layout base component"
```

---

### Task 4: 导航栏 Navbar

**Files:**
- Create: `D:/Blog/src/components/Navbar.astro`
- Create: `D:/Blog/src/scripts/navbar.ts`

**Interfaces:**
- Consumes: `SITE_CONFIG` from `src/config.ts`
- Produces: `<Navbar>` — 固定顶部导航栏，滚动后背景从透明变实色

- [ ] **Step 1: 创建 `src/components/Navbar.astro`**

```astro
---
import { SITE_CONFIG } from '../config';

const navLinks = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog/' },
  { label: '项目', href: '/#projects' },
];
---

<header class="navbar" id="navbar">
  <div class="navbar-inner">
    <a href="/" class="navbar-brand">{SITE_CONFIG.name}</a>
    <nav class="navbar-links" id="navbar-links">
      {navLinks.map(link => (
        <a href={link.href} class="navbar-link">
          {link.label}
        </a>
      ))}
    </nav>
  </div>
</header>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: var(--nav-height);
    background: transparent;
    backdrop-filter: blur(0px);
    transition: background var(--transition), backdrop-filter var(--transition);
  }

  .navbar.scrolled {
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
  }

  .navbar-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbar-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: 1px;
  }

  .navbar-brand:hover {
    color: var(--color-primary-light);
  }

  .navbar-links {
    display: flex;
    gap: 32px;
  }

  .navbar-link {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    font-weight: 500;
    position: relative;
    padding: 4px 0;
  }

  .navbar-link:hover,
  .navbar-link[data-current='true'] {
    color: var(--color-text);
  }

  .navbar-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent));
    transition: width var(--transition);
  }

  .navbar-link:hover::after,
  .navbar-link[data-current='true']::after {
    width: 100%;
  }
</style>

<script>
  // Scroll transparency
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  // Highlight current page link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (href !== '/' && currentPath.startsWith(href)))) {
      link.setAttribute('data-current', 'true');
    }
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/Navbar.astro
git commit -m "feat: add Navbar with scroll transparency effect"
```

---

### Task 5: 页脚 Footer

**Files:**
- Create: `D:/Blog/src/components/Footer.astro`

**Interfaces:**
- Produces: `<Footer>` — © 版权信息 + 技术驱动说明

- [ ] **Step 1: 创建 `src/components/Footer.astro`**

```astro
<footer class="footer">
  <div class="footer-inner">
    <p>&copy; 2026 Layla &middot; 由 Astro 驱动</p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
    padding: 32px 24px;
    text-align: center;
  }

  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .footer p {
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

### Task 6: Hero 区域 + 粒子动画背景

**Files:**
- Create: `D:/Blog/src/components/Hero.astro`

**Interfaces:**
- Consumes: `SITE_CONFIG`, `SOCIAL_LINKS` from `src/config.ts`
- Produces: `<Hero>` — 全屏 Hero 区，含 Canvas 粒子动画、头像、名字、社交图标

- [ ] **Step 1: 创建 `src/components/Hero.astro`**

```astro
---
import { SITE_CONFIG, SOCIAL_LINKS } from '../config';
---

<section class="hero" id="hero">
  <canvas id="particles" class="hero-canvas"></canvas>
  <div class="hero-content">
    <img
      src={SITE_CONFIG.avatar}
      alt={SITE_CONFIG.name}
      class="hero-avatar"
      width="120"
      height="120"
    />
    <h1 class="hero-title">Hi, 我是 {SITE_CONFIG.name}</h1>
    <p class="hero-subtitle">{SITE_CONFIG.subtitle}</p>
    <div class="hero-social">
      {SOCIAL_LINKS.map((link) => (
        <a href={link.url} class="hero-social-link" target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  </div>
  <div class="hero-scroll-hint">
    <span>▼</span>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 24px;
  }

  .hero-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid var(--color-primary);
    margin: 0 auto 32px;
    object-fit: cover;
    box-shadow: 0 0 40px rgba(108, 99, 255, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--color-text), var(--color-primary-light));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: 1.15rem;
    color: var(--color-text-muted);
    margin-bottom: 32px;
    letter-spacing: 2px;
  }

  .hero-social {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .hero-social-link {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    padding: 8px 20px;
    border: 1px solid var(--color-border);
    border-radius: 24px;
    transition: all var(--transition);
  }

  .hero-social-link:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  }

  .hero-scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    animation: bounce 2s infinite;
  }

  .hero-scroll-hint span {
    color: var(--color-text-muted);
    font-size: 1.2rem;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-8px); }
    60% { transform: translateX(-50%) translateY(-4px); }
  }
</style>

<script>
  (function () {
    const canvas = document.getElementById('particles') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = 80;
    const CONNECT_DISTANCE = 150;

    class Particle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;

      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108, 99, 255, 0.6)';
        ctx.fill();
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(108, 99, 255, ${1 - dist / CONNECT_DISTANCE})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      // draw particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx!);
      });
      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
  })();
</script>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/Hero.astro
git commit -m "feat: add Hero section with particle animation background"
```

---

### Task 7: About 关于我区域

**Files:**
- Create: `D:/Blog/src/components/About.astro`

**Interfaces:**
- Consumes: `SITE_CONFIG`, `SKILLS` from `src/config.ts`
- Produces: `<About>` — 自我介绍段落 + 技能标签云

- [ ] **Step 1: 创建 `src/components/About.astro`**

```astro
---
import { SITE_CONFIG, SKILLS } from '../config';
---

<section class="section reveal" id="about">
  <h2 class="section-title">关于我</h2>
  <p class="about-bio">{SITE_CONFIG.bio}</p>
  <div class="skills-cloud">
    {SKILLS.map((skill) => <span class="skill-tag">{skill}</span>)}
  </div>
</section>

<style>
  .about-bio {
    max-width: 600px;
    margin: 0 auto 36px;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 1.05rem;
    line-height: 1.8;
  }

  .skills-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    max-width: 500px;
    margin: 0 auto;
  }

  .skill-tag {
    padding: 6px 18px;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--color-primary-light);
    background: rgba(108, 99, 255, 0.08);
    transition: all var(--transition);
  }

  .skill-tag:hover {
    background: rgba(108, 99, 255, 0.2);
    box-shadow: 0 0 16px rgba(108, 99, 255, 0.3);
    transform: translateY(-2px);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/About.astro
git commit -m "feat: add About section with skill tags"
```

---

### Task 8: 项目卡片组件

**Files:**
- Create: `D:/Blog/src/components/ProjectCard.astro`

**Interfaces:**
- Consumes: project entry from collection (with `name`, `description`, `tags`, `image`, `link`, `linkText` fields)
- Produces: `<ProjectCard>` — 单张项目卡片，含悬停上浮 + 边框发光效果

- [ ] **Step 1: 创建 `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  name: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  linkText?: string;
}

const { name, description, tags, image, link, linkText = '查看项目' } = Astro.props;
---

<div class="project-card reveal">
  {image && (
    <div class="project-image">
      <img src={image} alt={name} loading="lazy" />
    </div>
  )}
  <div class="project-body">
    <h3 class="project-name">{name}</h3>
    <p class="project-desc">{description}</p>
    <div class="project-tags">
      {tags.map((tag) => <span class="project-tag">{tag}</span>)}
    </div>
    {link && (
      <a href={link} class="project-link" target="_blank" rel="noopener noreferrer">
        {linkText} →
      </a>
    )}
  </div>
</div>

<style>
  .project-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  }

  .project-card:hover {
    transform: translateY(-8px);
    border-color: var(--color-primary);
    box-shadow: 0 8px 40px rgba(108, 99, 255, 0.2);
  }

  .project-image {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: var(--color-bg);
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition);
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .project-body {
    padding: 24px;
  }

  .project-name {
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text);
  }

  .project-desc {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .project-tag {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 12px;
    background: rgba(108, 99, 255, 0.12);
    color: var(--color-primary-light);
  }

  .project-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-accent);
  }

  .project-link:hover {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/components/ProjectCard.astro
git commit -m "feat: add ProjectCard component with hover effects"
```

---

### Task 9: 项目展示区 + BlogPreview 组件

**Files:**
- Create: `D:/Blog/src/components/Projects.astro`
- Create: `D:/Blog/src/components/BlogPreview.astro`

**Interfaces:**
- Consumes: projects collection data via `getCollection('projects')`
- Produces: `<Projects>` — 3 列项目卡片网格
- Produces: `<BlogPreview>` — 首页最新 3 篇文章卡片

- [ ] **Step 1: 创建 `src/components/Projects.astro`**

```astro
---
import { getCollection } from 'astro:content';
import ProjectCard from './ProjectCard.astro';

const projects = await getCollection('projects');
const featured = projects.filter((p) => p.data.featured);
---

<section class="section" id="projects">
  <h2 class="section-title">我的项目</h2>
  <div class="projects-grid">
    {featured.map((project) => (
      <ProjectCard
        name={project.data.name}
        description={project.data.description}
        tags={project.data.tags}
        image={project.data.image}
        link={project.data.link}
        linkText={project.data.linkText}
      />
    ))}
  </div>
</section>

<style>
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  @media (max-width: 900px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: 创建 `src/components/BlogPreview.astro`**

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? !data.draft : true;
});

const recentPosts = posts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);
---

<section class="section" id="blog-preview">
  <h2 class="section-title">最新文章</h2>
  <div class="blog-preview-grid">
    {recentPosts.map((post) => (
      <article class="blog-preview-card reveal">
        <time class="blog-preview-date">
          {post.data.date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h3 class="blog-preview-title">
          <a href={`/blog/${post.slug}/`}>{post.data.title}</a>
        </h3>
        {post.data.description && (
          <p class="blog-preview-desc">{post.data.description}</p>
        )}
      </article>
    ))}
  </div>
  <div class="blog-preview-more">
    <a href="/blog/" class="btn-more">查看全部博客 →</a>
  </div>
</section>

<style>
  .blog-preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 900px) {
    .blog-preview-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .blog-preview-grid {
      grid-template-columns: 1fr;
    }
  }

  .blog-preview-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 24px;
    transition: border-color var(--transition);
  }

  .blog-preview-card:hover {
    border-color: var(--color-primary);
  }

  .blog-preview-date {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    display: block;
    margin-bottom: 8px;
  }

  .blog-preview-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .blog-preview-title a {
    color: var(--color-text);
  }

  .blog-preview-title a:hover {
    color: var(--color-primary-light);
  }

  .blog-preview-desc {
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .blog-preview-more {
    text-align: center;
    margin-top: 40px;
  }

  .btn-more {
    display: inline-block;
    padding: 10px 28px;
    border: 1px solid var(--color-primary);
    border-radius: 24px;
    color: var(--color-primary-light);
    font-size: 0.95rem;
    transition: all var(--transition);
  }

  .btn-more:hover {
    background: rgba(108, 99, 255, 0.15);
    box-shadow: 0 0 20px rgba(108, 99, 255, 0.2);
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
cd D:/Blog
git add src/components/Projects.astro src/components/BlogPreview.astro
git commit -m "feat: add Projects grid and BlogPreview components"
```

---

### Task 10: 首页 — 组装所有组件

**Files:**
- Create: `D:/Blog/src/pages/index.astro`

**Interfaces:**
- Consumes: Layout, Navbar, Hero, About, Projects, BlogPreview, Footer components
- Produces: 首页完整页面

- [ ] **Step 1: 创建 `src/pages/index.astro`**

```astro
---
import Layout from '../components/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Projects from '../components/Projects.astro';
import BlogPreview from '../components/BlogPreview.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <Navbar />
  <main>
    <Hero />
    <About />
    <Projects />
    <BlogPreview />
  </main>
  <Footer />
</Layout>

<script>
  // Scroll reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

- [ ] **Step 2: Commit**

```bash
cd D:/Blog
git add src/pages/index.astro
git commit -m "feat: assemble homepage with all sections"
```

---

### Task 11: 博客文章列表页 + 详情页

**Files:**
- Create: `D:/Blog/src/pages/blog/index.astro`
- Create: `D:/Blog/src/pages/blog/[slug].astro`

**Interfaces:**
- Consumes: blog content collection
- Produces: `/blog/` 文章列表页, `/blog/[slug]/` 单篇文章页（含代码高亮）

- [ ] **Step 1: 创建 `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../components/Layout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';

const posts = await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? !data.draft : true;
});

const sortedPosts = posts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);
---

<Layout title="博客">
  <Navbar />
  <main style="padding-top: calc(var(--nav-height) + 40px);">
    <div class="section">
      <h1 class="section-title">所有文章</h1>
      <div class="blog-list">
        {sortedPosts.map((post) => (
          <article class="blog-list-item reveal">
            <time class="blog-list-date">
              {post.data.date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h2 class="blog-list-title">
              <a href={`/blog/${post.slug}/`}>{post.data.title}</a>
            </h2>
            {post.data.description && (
              <p class="blog-list-desc">{post.data.description}</p>
            )}
            {post.data.tags.length > 0 && (
              <div class="blog-list-tags">
                {post.data.tags.map((tag) => (
                  <span class="blog-list-tag">{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  </main>
  <Footer />
</Layout>

<style>
  .blog-list {
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .blog-list-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 28px;
    transition: border-color var(--transition);
  }

  .blog-list-item:hover {
    border-color: var(--color-primary);
  }

  .blog-list-date {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .blog-list-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 8px 0;
  }

  .blog-list-title a {
    color: var(--color-text);
  }

  .blog-list-title a:hover {
    color: var(--color-primary-light);
  }

  .blog-list-desc {
    font-size: 0.95rem;
    color: var(--color-text-muted);
  }

  .blog-list-tags {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .blog-list-tag {
    font-size: 0.75rem;
    padding: 2px 10px;
    border-radius: 12px;
    background: rgba(108, 99, 255, 0.12);
    color: var(--color-primary-light);
  }
</style>

<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

- [ ] **Step 2: 创建 `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../components/Layout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={post.data.title}>
  <Navbar />
  <main style="padding-top: calc(var(--nav-height) + 40px);">
    <article class="post-article">
      <header class="post-header">
        <time class="post-date">
          {post.data.date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 class="post-title">{post.data.title}</h1>
        {post.data.tags.length > 0 && (
          <div class="post-tags">
            {post.data.tags.map((tag) => (
              <span class="post-tag">{tag}</span>
            ))}
          </div>
        )}
      </header>
      <div class="post-content">
        <Content />
      </div>
    </article>
  </main>
  <Footer />
</Layout>

<style>
  .post-article {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  .post-header {
    text-align: center;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--color-border);
  }

  .post-date {
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .post-title {
    font-size: 2.2rem;
    font-weight: 800;
    margin: 12px 0;
    background: linear-gradient(135deg, var(--color-text), var(--color-primary-light));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .post-tags {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .post-tag {
    font-size: 0.8rem;
    padding: 3px 12px;
    border-radius: 12px;
    background: rgba(108, 99, 255, 0.12);
    color: var(--color-primary-light);
  }

  .post-content {
    font-size: 1.05rem;
    line-height: 1.9;
    color: var(--color-text);
  }

  .post-content :global(h2) {
    font-size: 1.6rem;
    margin: 48px 0 16px;
    color: var(--color-accent);
  }

  .post-content :global(h3) {
    font-size: 1.3rem;
    margin: 32px 0 12px;
  }

  .post-content :global(p) {
    margin-bottom: 20px;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    margin-bottom: 20px;
    padding-left: 24px;
  }

  .post-content :global(li) {
    margin-bottom: 8px;
  }

  .post-content :global(blockquote) {
    border-left: 3px solid var(--color-primary);
    padding-left: 20px;
    margin: 24px 0;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .post-content :global(img) {
    border-radius: var(--radius);
    margin: 24px auto;
  }

  .post-content :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
cd D:/Blog
git add src/pages/blog/
git commit -m "feat: add blog list and post detail pages"
```

---

### Task 12: 迁移旧博客文章 + 创建示例项目

**Files:**
- Create: `D:/Blog/src/content/blog/2026-03-18-first-post.md`
- Create: `D:/Blog/src/content/blog/2026-05-27-test.md`
- Create: `D:/Blog/src/content/projects/sample-project.md`

**Interfaces:**
- Produces: 2 篇可用的博客文章内容 + 1 个示例项目数据

- [ ] **Step 1: 创建 `src/content/blog/2026-03-18-first-post.md`**

```md
---
title: 第一篇文章
date: 2026-03-18
tags:
  - 随笔
description: 这是我的第一篇博客文章。
---

这是我的第一篇博客文章，创建于 2026 年 3 月 18 日星期三。
```

- [ ] **Step 2: 创建 `src/content/blog/2026-05-27-test.md`**

```md
---
title: 2026.5.27test
date: 2026-05-27
tags:
  - test
---

2026.5.27test
```

- [ ] **Step 3: 创建 `src/content/projects/course-design.md`（示例项目）**

```md
---
name: 学生信息管理系统
description: C++ 课程设计，支持学生信息的增删改查，使用 Qt 开发图形界面。
tags:
  - C++
  - Qt
  - 课程设计
link: https://github.com/cry903
featured: true
---
```

- [ ] **Step 4: 创建 `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#6c63ff"/>
  <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">L</text>
</svg>
```

- [ ] **Step 5: 创建头像占位说明**

在 `public/` 下，用户需要自行放一张 `avatar.png`（120x120 以上的正方形图片）。可以先不提交，后面用户添加。

- [ ] **Step 6: Commit**

```bash
cd D:/Blog
git add src/content/blog/ src/content/projects/ public/favicon.svg
git commit -m "feat: migrate old blog posts and add sample project"
```

---

### Task 13: GitHub Actions 部署

**Files:**
- Create: `D:/Blog/.github/workflows/deploy.yml`
- Ensure: `D:/Blog/public/CNAME` 内容为 `lay1a.me`

**Interfaces:**
- Produces: 推送代码到 GitHub 后自动构建并部署到 `cry903.github.io`

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 确保 CNAME 文件在 public/ 下**

```bash
# 检查 public/CNAME 内容
cat D:/Blog/public/CNAME
# 应该输出: lay1a.me
```

- [ ] **Step 3: Commit**

```bash
cd D:/Blog
git add .github/workflows/deploy.yml public/CNAME
git commit -m "feat: add GitHub Actions deploy workflow"
```

---

### Task 14: 本地构建验证

**Files:**
- 无需新建文件

- [ ] **Step 1: 构建项目**

```bash
cd D:/Blog
npm run build
```

**预期输出**：构建成功，在 `D:/Blog/dist/` 下生成静态文件。无报错。

- [ ] **Step 2: 检查构建产物结构**

```bash
ls D:/Blog/dist/
```

确认 `dist/` 下有 `index.html`、`blog/` 目录、`CNAME` 等。

- [ ] **Step 3: 最终 Commit**

```bash
cd D:/Blog
git add -A
git commit -m "chore: finalize build and all assets"
```

---

### Task 15: 推送代码到 GitHub 并设置部署

**Files:**
- 无需新建文件

- [ ] **Step 1: 创建 GitHub 仓库并推送**

```bash
cd D:/Blog
git remote add origin git@github.com:cry903/cry903.github.io.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: 在 GitHub 上设置 Pages**

在仓库 Settings → Pages 中：
- Source: "GitHub Actions"
- Custom domain: `lay1a.me`
- Enforce HTTPS: ✅

- [ ] **Step 3: 等待部署完成后访问 https://lay1a.me/ 验证**

---

## Completion Checklist

- [ ] `npm run build` 构建成功，无报错
- [ ] 首页显示粒子动画背景、头像、名字、社交链接
- [ ] 关于我区域显示技能标签
- [ ] 项目展示区显示项目卡片，悬停有动画
- [ ] 最新文章显示已有文章，点击进入阅读
- [ ] 博客列表页 (`/blog/`) 可访问
- [ ] 导航栏滚动后背景变实色
- [ ] 手机端布局正常（响应式）
- [ ] 部署后 `lay1a.me` 可正常访问
