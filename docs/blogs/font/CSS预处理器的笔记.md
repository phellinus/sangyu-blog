# 🧱 CSS 预处理器的笔记

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-11-01  
> 🧠 关键词：scss，minix


🧩 前言

最近在用react为基础，写一套组件库，作为一个有着审美追求的项目，样式的设计就显得非常重要，项目中我使用scss和minix来设计样式。
那今天的博客就来介绍一下什么是scss和minix。
组件库的开发也是完成了按钮这个设计，同时也做个复盘和总结。

## 一、什么是 SCSS

首先先讲讲什么是scss
**SCSS（Sassy CSS）** 是一种 CSS 预处理语言（Preprocessor），它让 CSS 拥有类似编程语言的功能：

- 支持变量 `$`
- 支持嵌套结构
- 支持 Mixin（代码片段复用）
- 支持条件、循环、函数等逻辑
- 支持模块化导入（`@use`、`@forward`）

> ✅ **SCSS 最终编译为标准 CSS，浏览器不直接解析 `.scss` 文件。**


## 二、SCSS vs Css

| 特性             | SCSS                    | CSS  |
| ---------------- | ----------------------- | ---- |
| 是否支持变量     | ✅ `$primary-color`      | ❌    |
| 是否支持嵌套     | ✅ `.nav ul li {}`       | ❌    |
| 是否支持函数逻辑 | ✅ `@mixin`、`@function` | ❌    |
| 是否模块化       | ✅ `@use`、`@forward`    | ❌    |
| 是否需要编译     | ✅                       | ❌    |

## 三、变量（Variables）

### 1️⃣ 定义变量

```scss
$primary-color: #409eff;
$btn-radius: 6px;
$btn-padding-x: 16px;
$btn-padding-y: 8px;
```

### 2️⃣ 使用变量

```scss
.btn {
  background-color: $primary-color;
  border-radius: $btn-radius;
  padding: $btn-padding-y $btn-padding-x;
}
```

### 3️⃣ 结合 CSS 变量（动态主题）

项目中既使用 `$`（Sass变量）也使用 `--`（CSS变量）：

```scss
.btn-filled {
  color: var(--btn-text);
  background-color: var(--btn-bg);
  border-color: var(--btn-border);
}
```

- `$`：编译时变量（写死在 CSS 中）
- `--`：运行时变量（可通过 JS 或主题切换动态改变）

> ✅ **技巧：** 用 `$` 管控尺寸，用 `--` 管控颜色。


## 四、项目中的运用

在设计这个按钮组件时，由于按钮我设置了不同的类型。比如说filled、border、link等。
他们的样式有些不同，filled类型的按钮颜色会充满整个按钮，border类型的按钮颜色就是边框。
同时使用这套组件库时，按钮的颜色也支持自定义，也可以传递全局设置好的颜色变量，比如primary、success...
所以当传递这个颜色的变量的时候，我会先检查这个变量时候时全局设置好的颜色变量，如果不是，那就用自定义的颜色
具体代码如下：
``` scss
export enum ButtonType {
    Filled = 'filled',
    Link = 'link',
    Border = 'border',
    Flat = 'flat',
    Line = 'line',
    Gradient = 'gradient',
    Relief = 'relief',
}

// 判断颜色是预设名还是自定义色值
const baseColor = presetColors[color] || color;

// 基于类型定义不同的变量
const styleVars: React.CSSProperties = {
    '--btn-bg': btnType === ButtonType.Border ? '#fff' : baseColor,
    '--btn-border': baseColor,
    '--btn-text': textColor || (btnType === ButtonType.Border || btnType === ButtonType.Line ? baseColor : '#fff'),
    '--btn-hover-bg': btnType === ButtonType.Border ? baseColor : baseColor,
    '--btn-hover-text': btnType === ButtonType.Border || btnType === ButtonType.Line ? '#fff' : '#fff',
} as React.CSSProperties;
```
之后在各种类型的按钮中，我会根据按钮的类型，来判断是否需要设置不同的样式变量。
```scss
//Flat按钮
.btn-flat {
  background-color: transparent;
  color: var(--btn-border);
  border: none;
  box-shadow: none;

  &:hover {
    background-color: var(--btn-border);
    color: #fff;
  }
}
```


## 五、Scss的语法总结

通过开发这个按钮组件，我总结了scss的一些语法。主要是以下几方面
- 嵌套选择器（Nesting）
- 父选择器引用符 &
- 多选择器组合
- CSS 变量与作用范围

🧩 一、外层选择器 .btn-filled

```scss
.btn-filled {
    color: var(--btn-text);
}
```
这一行就是标准的 CSS 定义写法，意思是：

所有带有 .btn-filled 类名的元素，其文字颜色由 CSS 变量 --btn-text 决定。

这里的 var(--btn-text) 是一个 CSS 变量（Custom Property）。
这种变量的值可以在运行时动态改变，比如通过 JS 或主题切换来控制颜色。
示例：
```scss
:root {
  --btn-text: #ffffff;
}

.btn-filled {
  color: var(--btn-text); /* 运行时从根节点取变量值 */
}
```

🧱 二、嵌套选择器（Nesting）
```scss
.btn-filled {
  &:hover,
  &.hover {
    box-shadow: 0 8px 24px -8px var(--btn-bg);
  }
}
```

这里用的就是 嵌套规则（Nesting），是 SCSS 的一大特色。
在普通 CSS 里你可能会这样写：

```css
.btn-filled:hover,
.btn-filled.hover {
  box-shadow: 0 8px 24px -8px var(--btn-bg);
}
```

但是在 SCSS 里，可以用嵌套写法让层次更清晰：
```scss
.btn-filled {
  &:hover,
  &.hover {
    box-shadow: 0 8px 24px -8px var(--btn-bg);
  }
}
```

🔍 三、父选择器引用符 &

& 是 SCSS 的一个特殊符号，表示 当前父级选择器的引用。
也就是在这里，& 代表 .btn-filled。

✅ 展开后会编译为：
```css
.btn-filled:hover,
.btn-filled.hover {
  box-shadow: 0 8px 24px -8px var(--btn-bg);
}
```

💡 常见用法示例：

| **SCSS 写法** | **编译后结果** | **含义**                   |
| ------------- | -------------- | -------------------------- |
| &:hover       | .btn:hover     | 鼠标悬停状态               |
| &.active      | .btn.active    | 元素同时拥有两个类         |
| &::before     | .btn::before   | 伪元素                     |
| .card &       | .card .btn     | 父级选择器嵌套（反向引用） |

🎨 四、多选择器组合

```scss
&:hover,
&.hover {
  box-shadow: 0 8px 24px -8px var(--btn-bg);
}
```

这里用逗号 , 分隔多个选择器，表示 同时匹配以下两种情况：

1️⃣ :hover → 鼠标悬停状态
2️⃣ .hover → 元素手动添加 .hover 类的状态（如 JS 控制）

✅ 这种写法常用于兼容两种交互方式：
视觉 hover 效果 + 程序控制的 hover 状态。

🧠 五、CSS 变量（var）
```scss
color: var(--btn-text);
box-shadow: 0 8px 24px -8px var(--btn-bg);
```

SCSS 编译时不会计算 CSS 变量，它会原封不动输出到最终的 CSS 文件中。
因为 CSS 变量是在 浏览器运行时 由样式表解析的。

项目里这类变量通常来自按钮主题定义：
```css
:root {
    --btn-bg: #409eff;
    --btn-text: #ffffff;
}
```
所以最终效果是：

```css
.btn-filled {
  color: #ffffff;
}

.btn-filled:hover,
.btn-filled.hover {
  box-shadow: 0 8px 24px -8px #409eff;
}
```