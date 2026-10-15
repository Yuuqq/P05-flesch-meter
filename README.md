# P05 新闻阅读门槛测算仪

> 新闻阅读门槛测算仪

[![Live Demo](https://img.shields.io/badge/Live-Demo-c7491f?style=for-the-badge)](https://yuuqq.github.io/P05-flesch-meter/)
[![PWA](https://img.shields.io/badge/PWA-Offline_Ready-4ade80?style=for-the-badge)](#)

## 🚀 在线体验

**[https://yuuqq.github.io/P05-flesch-meter/](https://yuuqq.github.io/P05-flesch-meter/)**

可以注册 Service Worker。离线是否可用，取决于安装时核心文件有没有进缓存。

## 本地运行

在仓库目录执行 `python3 -m http.server`，打开页面即可。计算逻辑不依赖外链。旁边如果没有 `../shared/`，设计令牌和 `loader.js` 会 404，暗色模式和命令面板不会出现。这条回退由 [PR #1](https://github.com/Yuuqq/P05-flesch-meter/pull/1) 处理。

## ✨ 功能特性

- 🌗 暗色/亮色模式（由 `../shared/releases/v2.6/loader.js` 提供）
- 🔍 `Ctrl+K` 跨工具搜索跳转（同上，依赖 shared）
- 📱 本目录 `sw.js` 缓存同域静态文件
- ♿ 操作按钮使用可见中文名称；结果区用 `aria-live` 播报
- 🔒 稿件只在浏览器本地计算，不上传



## 🛠️ 技术栈

- 纯 HTML + CSS + JavaScript（零依赖框架）
- CSS 变量设计令牌系统
- Service Worker 缓存策略

## 📦 本页实际加载

- `../shared/design-tokens.css` — 设计令牌
- `../shared/releases/v2.6/loader.js` — 暗色、命令面板、引导等（`data-modules`）
- `sw.js` — 本工具 Service Worker，只清理 `journalism-tool-P05-` 前缀的缓存
- `pm-metrics.js` — 使用记录写在本地 `localStorage`，最多保留 500 条

## 📄 许可

本项目为新闻素养教学工具，仅供学习与研究使用。

---

*本项目是 [新闻素养工具箱](https://yuuqq.github.io/journalism-toolbox/) 的第 05 号工具。*
