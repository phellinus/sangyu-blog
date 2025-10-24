# 🔄 React vs Vue：Vue有reactive，React有什么

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-10-24  
> 🧩 适用：React + TypeScript 项目  
> 🧠 关键词：useState、useReducer、useImmer、useRef

## 🌱 一、Vue 的 `reactive()` 是什么？

在 Vue 3 中，我们可以使用 `reactive()` 快速创建一个响应式对象：

```ts
import { reactive } from 'vue';

const state = reactive({
  user: { name: 'Tom', age: 18 },
  count: 0,
});
```

### ✅ 特点

1. 基于 **ES6 Proxy** 实现，能深层监听对象变化；
2. 支持任意层级属性的响应式；
3. 修改属性即可更新视图；
4. 不需要显式调用更新函数。

Vue 的响应式是**自动、可追踪、递归**的。


## ⚛️ 二、React 没有 `reactive()`，但有多种组合方式实现相似效果

React 本身遵循“**函数式编程 + 不可变数据（immutable data）**”理念。  
因此它没有一个完全等价的 `reactive()`，而是通过 **Hooks** 和 **不可变更新** 来实现响应式视图。


## 🔹 1. `useState` —— 基础状态管理（最常见）

```tsx
import { useState } from 'react';

function Example() {
  const [user, setUser] = useState({ name: 'Tom', age: 18 });

  const changeAge = () => {
    setUser({ ...user, age: user.age + 1 });
  };

  return (
    <div>
      <p>{user.name} - {user.age}</p>
      <button onClick={changeAge}>增加年龄</button>
    </div>
  );
}
```

## 🔹 2. `useReducer` —— 管理复杂状态逻辑

```tsx
import { useReducer } from 'react';

interface State {
  count: number;
  user: { name: string };
}

type Action =
  | { type: 'inc' }
  | { type: 'setName'; name: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc':
      return { ...state, count: state.count + 1 };
    case 'setName':
      return { ...state, user: { ...state.user, name: action.name } };
  }
}

export default function Example() {
  const [state, dispatch] = useReducer(reducer, { count: 0, user: { name: 'Tom' } });

  return (
    <>
      <p>{state.user.name} - {state.count}</p>
      <button onClick={() => dispatch({ type: 'inc' })}>加一</button>
      <button onClick={() => dispatch({ type: 'setName', name: 'Jerry' })}>改名</button>
    </>
  );
}
```

## 🔹 3. `useImmer` —— 最接近 Vue 的写法

```bash
npm install use-immer
```

```tsx
import { useImmer } from 'use-immer';

function Example() {
  const [state, updateState] = useImmer({
    user: { name: 'Tom', age: 18 },
    count: 0,
  });

  const increment = () => {
    updateState(draft => {
      draft.count++;
      draft.user.age++;
    });
  };

  return (
    <>
      <p>{state.user.name} - {state.user.age} - {state.count}</p>
      <button onClick={increment}>增加</button>
    </>
  );
}
```


## 📊 五、对比表：Vue vs React 响应式机制

| 特性               | Vue (`reactive`)     | React 对应方案                               |
| ------------------ | -------------------- | -------------------------------------------- |
| 定义响应式对象     | `reactive({ a: 1 })` | `useState()` / `useReducer()` / `useImmer()` |
| 属性更新后自动渲染 | ✅ 自动               | ❌ 需返回新对象（`useImmer` 除外）            |
| 嵌套对象深层响应   | ✅ 自动追踪           | ❌ 默认浅比较                                 |
| 不可变数据理念     | 否                   | ✅ 强制不可变                                 |
| 临时变量           | `ref()`              | `useRef()`                                   |
| 状态集中管理       | Vuex / Pinia         | useReducer / Zustand / Redux                 |


## 🚀 六、总结与建议

| 场景                | 推荐方案     |
| ------------------- | ------------ |
| 简单组件状态        | `useState`   |
| 多状态、复杂逻辑    | `useReducer` |
| 想写出 Vue 风格代码 | `useImmer`   |
| 存临时变量          | `useRef`     |

> Vue 的 `reactive()` 是自动的、基于 Proxy 的响应式；  
> React 则是显式的、基于不可变数据的更新。  
> 如果想在 React 里拥有类似 Vue 的开发体验，用 `useImmer()` 是最佳选择。
