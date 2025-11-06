# 🧠 vue路由的三种模式

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-11-04  
> 🧠 关键词：vue路由、路由模式、hash模式、history模式、abstract模式

## 一、概述

在 Vue 中，路由（Routing） 用于在单页应用（SPA）中实现页面之间的切换。
Vue 官方提供的路由管理器是 vue-router，支持多种路由模式。

## 二、Vue 路由的三种模式

Vue Router 支持三种主要路由模式：

| 路由模式              | URL 示例                     | 是否需要服务器配置 | 兼容性                | 说明                                                   |
| --------------------- | ---------------------------- | ------------------ | --------------------- | ------------------------------------------------------ |
| **Hash 模式**（默认） | `https://example.com/#/home` | ❌ 否               | ✅ 最好                | 使用 URL hash（#）模拟完整路径                         |
| **History 模式**      | `https://example.com/home`   | ✅ 需要             | ⚠️ 较差（IE9+）        | 利用 HTML5 History API（`pushState` / `replaceState`） |
| **Abstract 模式**     | 无 URL（或自定义）           | ❌ 否               | 🧠 Node / 无浏览器环境 | 用于服务端渲染或测试环境                               |

---

## 三、各路由模式原理与特点
### 1️⃣ **Hash 模式（默认模式）**

#### 🧩 原理

- 利用浏览器的 **`location.hash`** 特性；
- “#” 之后的内容不会被发送到服务器；
- 通过监听 `hashchange` 事件实现页面切换。

#### ⚙️ 示例
```
URL: https://example.com/#/about
```

当 `#` 后的路径变化时，Vue Router 根据 `#/about` 匹配对应组件。

#### ✅ 优点

- 无需服务器配置；
- 兼容性好；
- 刷新不会 404。

#### ⚠️ 缺点

- URL 中带 `#`，不够美观；
- 不利于 SEO。

### 2️⃣ **History 模式（HTML5 模式）**

#### 🧩 原理

- 利用 HTML5 的 **History API**：`pushState()`、`replaceState()`；
- URL 表面上是真实路径，但不刷新页面；
- 通过浏览器历史栈控制前进后退。

#### ⚙️ 示例
```
URL: https://example.com/about
```

#### ✅ 优点

- URL 美观、真实；
- 更符合“传统网站”路径结构；
- 更利于 SEO（需配合 SSR 或后端渲染）。

#### ⚠️ 缺点

- **刷新页面会 404**（因为服务器找不到这个路径）；
- 需要 **服务器配置**：
  所有请求都应重定向到 `index.html`。

#### 💡 Nginx 配置示例
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 3️⃣ **Abstract 模式**

#### 🧩 原理

- 不依赖浏览器的地址栏；
- 使用 **内存中的路由记录栈** 实现跳转；
- 常用于 **Node.js 环境 / 单元测试 / SSR**。

#### ✅ 优点

- 不依赖浏览器环境；
- 可在服务端运行；
- 适合无 UI 场景。

#### ⚠️ 缺点

- URL 不会变化；
- 仅用于特殊环境（如 SSR、Electron）。

## 四、路由模式的配置方式

在创建路由实例时通过 `mode` 指定：
```js

import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),      // History 模式
  // history: createWebHashHistory(), // Hash 模式
  // history: createMemoryHistory(),  // Abstract 模式（SSR）
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})

export default router
```

Vue 2 中写法为：
```js
const router = new VueRouter({
mode: 'history', // 或 'hash', 'abstract'
routes: [...]
})
```

## 五、三种模式的对比总结

| 对比项         | Hash 模式        | History 模式       | Abstract 模式   |
| -------------- | ---------------- | ------------------ | --------------- |
| URL 形式       | `/#/page`        | `/page`            | 无 URL          |
| 是否依赖浏览器 | ✅ 是             | ✅ 是               | ❌ 否            |
| 服务器支持要求 | ❌ 否             | ✅ 需重定向配置     | ❌ 否            |
| SEO 友好度     | ❌ 较差           | ✅ 较好（配合 SSR） | ❌ 不适用        |
| 刷新是否报错   | ❌ 否             | ✅ 若未配置会 404   | ❌ 否            |
| 使用场景       | 普通 SPA（默认） | SEO 友好项目       | Node / SSR 环境 |
| 监听方式       | `hashchange`     | `popstate`         | 内存栈          |

---

## 六、常见问题与注意事项

### ⚠️ 1. History 模式下页面刷新 404？

原因：后端服务器找不到前端路由路径。  
解决：后端配置重定向到 `index.html`。

---

### ⚠️ 2. Hash 模式切换正常，但部署到服务器后路径异常？

原因：某些服务器或 CDN 对 “#” 的处理不当；  
解决：确认服务器未过滤或修改 `#` 部分。

---

### ⚠️ 3. Abstract 模式什么时候用？

- SSR 渲染（Vue + Node）；
- Electron 桌面应用；
- 单元测试环境。

## 七、使用建议

| 场景                     | 推荐模式 |
| ------------------------ | -------- |
| 开发测试阶段             | Hash     |
| 生产部署（纯前端项目）   | History  |
| 后端 SSR 项目 / Electron | Abstract |

---

## ## 八、总结口诀

> **Hash 简单无配置，History 美观需配置，Abstract 无界面环境用。**

---

## 