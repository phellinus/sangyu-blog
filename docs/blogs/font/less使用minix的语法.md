---
description: Less 实战：如何优雅抽取公共样式（Mixin + 参数化），干掉重复 CSS
sticky: 9
tags:
  - 前端
tag:
  - Less
---

# Less 实战：如何优雅抽取公共样式（Mixin + 参数化），干掉重复 CSS

> ✍️ 作者：桑榆  
> 
> 🕓 更新时间：2025-12-5
> 
> 🧠 关键词: less、mixin

## 🧩 前言
在组件库或业务组件里，最常见的痛点之一就是 **样式拷贝**：左边一个 icon、右边一个 icon，90% 的 CSS 都一样，但你不得不写两份；后期要改 padding、hover 效果、transition，又得两边一起改，容易漏、容易不一致。

Less 作为 CSS 预处理器，提供了非常实用的能力：**Mixin（混入）**。它可以像函数一样复用样式，还能带参数，实现“公共逻辑 + 少量差异”的优雅写法。

这篇文章用一个输入框组件的 fronticon / backicon 为例，讲清楚 Less 抽离公共样式的核心套路。

## **1. 问题场景：重复样式的典型样子**

假设我们输入框结构是这样：

```html
<div class="sy-input">
  <div class="sy-input__fronticon">...</div>
  <div class="sy-input-center"><input /></div>
  <div class="sy-input__backicon">...</div>
</div>
```

很多人一开始会写成：

```less
.sy-input__fronticon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: 0.18s;
  // ...
  &:hover { /* ... */ }
}

.sy-input__backicon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: 0.18s;
  // ...
  &:hover { /* ... */ }
}
```

你会发现：除了左右 margin、阴影方向、hover translate 方向不同，其余基本一致，重复非常多。

## **2. Less 的 Mixin 是什么？**

**Mixin** 可以理解为“可复用的一段 CSS 模板”。

Less 的 mixin 写法很像 class：

```less
.base() {
  display: flex;
  align-items: center;
}
```

使用时直接调用：

```less
.my-box {
  .base();
}
```

编译后 .my-box 会获得 .base() 里的所有样式。

✅ 关键点：

- mixin 可以写在任何选择器内部（更方便按组件范围组织）
- mixin 可以带参数（更强大）

## **3. 第一步：抽一个“基础公共样式” mixin**

先把两边 icon 完全一样的部分提取出来。

```less
.sy-input {
  .icon-side-base() {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;

    align-self: stretch;
    margin-top: calc(-0.8 * var(--sy-input-padding-y));
    margin-bottom: calc(-0.8 * var(--sy-input-padding-y));
    border-radius: inherit;

    padding: 0 calc(var(--sy-input-padding-y) + 2px);

    transition: transform 0.18s ease, opacity 0.18s ease,
      box-shadow 0.18s ease, background-color 0.18s ease, color 0.18s ease;
  }

  &__fronticon { .icon-side-base(); }
  &__backicon  { .icon-side-base(); }
}
```

这样未来你要改 transition/padding/align-self，只改 .icon-side-base() 就行。

## **4. 第二步：把 hover 也参数化（方向 / 阴影）**

两边 hover 的差异往往是：

- X 方向移动：左边是负，右边是正
- 阴影方向：可能一致，也可能一边要反向

我们可以写一个带参数的 mixin：

```less
.sy-input {
  .icon-side-hover(@xSign, @shadowX) {
    &:hover {
      background-color: rgb(249, 252, 253);
      transform: translate(
        calc(@xSign * 0.7 * var(--sy-input-padding-x)),
        calc(-0.7 * var(--sy-input-padding-x))
      );
      box-shadow: @shadowX 10px 10px -10px rgba(0, 0, 0, 0.1);
      color: var(--focus-border-color);
    }
  }

  &__fronticon { .icon-side-hover(-1, 15px); }
  &__backicon  { .icon-side-hover( 1, 15px); }
}
```

✅ 这样你就实现了“同一套 hover 模板，不同参数控制方向”。

## **5. 第三步：差异样式仍然留在各自的选择器里**

公共逻辑交给 mixin，真正的差异（左右 margin、默认阴影方向）仍然写在各自的类里，代码会非常清晰：

```less
.sy-input {
  &__fronticon {
    .icon-side-base();

    margin-left: calc(-1 * var(--sy-input-padding-x));
    margin-right: var(--sy-input-gap);

    box-shadow: 0 0 0 0 transparent;

    .icon-side-hover(-1, 15px);
  }

  &__backicon {
    .icon-side-base();

    margin-left: 0;
    margin-right: calc(-1 * var(--sy-input-padding-x));

    box-shadow: -15px 10px 10px -10px rgba(0, 0, 0, 0.05);

    .icon-side-hover(1, 15px);
  }
}
```

**阅读体验**变成：

- 一眼看懂公共核心是什么（base/hover）
- 一眼看懂两边到底差在哪（margin/默认阴影/方向）

## **6. 额外优化：focus-within 也别写两遍**

很多组件会在输入框 focus 时让左右 icon 同时高亮，这种也别重复写，可以统一写在父容器的 &:focus-within：

```less
.sy-input {
  &:focus-within {
    .sy-input__fronticon,
    .sy-input__backicon {
      background-color: rgb(249, 252, 253);
      color: var(--focus-border-color);
      box-shadow: 15px 10px 10px -10px rgba(0, 0, 0, 0.1);
    }

    .sy-input__fronticon {
      transform: translate(
        calc(-0.7 * var(--sy-input-padding-x)),
        calc(-0.7 * var(--sy-input-padding-x))
      );
    }

    .sy-input__backicon {
      transform: translate(
        calc(0.7 * var(--sy-input-padding-x)),
        calc(-0.7 * var(--sy-input-padding-x))
      );
    }
  }
}
```

这样：

- focus 状态统一从父容器控制
- 子元素只保留 base/hover 逻辑
- 不会出现“左边改了右边忘了”的情况

## **7. 这套抽离方式总结成一句话**

> Less 抽公共样式的最佳实践是：

> **“公共样式用 mixin，差异样式留在各自选择器里；需要变化的地方做参数化。”**