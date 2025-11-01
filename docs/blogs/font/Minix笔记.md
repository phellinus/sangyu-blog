# 📚 Mixin 全面指南

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-11-01  
> 🧠 关键词：minix

🧩 前言

在设计组件时，我会使用minix来定义一些通用的样式，比如按钮的样式，这样可以避免重复编写代码，同时也方便维护。
那这篇博客就来介绍一下什么是minix。

## 1. Mixin 是什么？

Mixin 是 Sass/SCSS 提供的代码复用机制。
它允许你把一段可参数化的样式定义（包括选择器嵌套、伪类、媒体查询、循环/条件等）封装起来，并通过 @include 在任意规则中复用。

简单点：把重复样式封成函数，随用随调，还能传参。

## 2. 为什么要用 Mixin（作用）
   -	消除重复：把项目里反复出现的样式（按钮、卡片、网格、响应式断点等）抽出来统一维护。
   -	可参数化：通过参数控制细节（如 padding、font-size、border-radius、主题变量等）。
   -	可组合：一个规则里可以多次 @include 不同 mixin，像搭积木一样构建复杂样式。
   -	包含逻辑：支持 @if / @each / @for 等，让样式复用更聪明。
   -	跨文件共享：配合 @use / @forward 做模块化管理，形成“设计系统”的基石。

## 3. 基础语法与用法

### 3.1 定义与使用

```scss
// 定义
@mixin button-size($py, $px, $font-size, $radius) {
  padding: $py $px;
  font-size: $font-size;
  border-radius: $radius;
}

// 使用
.btn {
  @include button-size(10px, 16px, 14px, 6px);
}
```

### 3.2 默认参数 & 关键字参数
```scss
@mixin ring($width: 2px, $color: currentColor) {
  box-shadow: 0 0 0 $width $color inset, 0 0 0 calc($width + 1px) rgba(0,0,0,.05);
}

// 关键字参数
.input { @include ring($color: #409eff, $width: 1px); }
```

### 3.3 可变参数（variadic）
```scss
@mixin bg-gradient($stops...) {
  background-image: linear-gradient($stops...);
}

.card {
  @include bg-gradient(180deg, #fff, #f8f9fa 60%, #eee);
}
```
### 3.4 带内容块的 mixin（@content）

```scss
@mixin mq($min) {
  @media (min-width: $min) { @content; }
}

.box {
  width: 100%;
  @include mq(768px) { width: 50%; }
  @include mq(1200px) { width: 33.33%; }
}
```

## 4. 项目中的按钮示例

我在_mixin.scss 中：定义了按钮的按钮的大小和风格
```scss
@mixin button-size($padding-y,$padding-x,$font-size,$border-radius) {
  padding: $padding-y $padding-x;
  font-size: $font-size;
  border-radius: $border-radius;
}

@mixin button-style() {
  color: var(--btn-text);
  background-color: var(--btn-bg);
  border-color: var(--btn-border);

  &:hover {
    color: var(--btn-hover-text, var(--btn-text));
    background-color: var(--btn-hover-bg, var(--btn-bg));
    border-color: var(--btn-hover-border, var(--btn-border));
    opacity: var(--btn-hover-opacity, 0.9);
  }

  &:focus,
  &.focus { outline: none; }

  &:disabled,
  &.disabled {
    cursor: not-allowed;
    opacity: var(--btn-disabled-opacity, 0.65);
    box-shadow: none;
  }
}
```
使用这两个 mixin
```scss
.btn {
  // 尺寸
  @include button-size(10px, 16px, 14px, 8px);

  // 主题样式（依赖 CSS 变量）
  @include button-style();
}
```