---
description: 介绍 React 中 JSX 语法的基础，包括语法规则、嵌入 JavaScript 表达式、属性指定等。
sticky: 100
---



# react笔记

## Part 1：JSX 语法入门笔记

#### 1. 什么是 JSX？

- **JSX** 是 **JavaScript XML** 的缩写。
- 它是一个 JavaScript 的**语法扩展**，允许你在 JavaScript 代码中编写类似 HTML 的结构。
- 它**不是**字符串，也**不是** HTML，最终会被编译成普通的 JavaScript 对象（React 元素）。
- JSX 是编写 React 组件最常用、最直观的方式。

#### 2. 为什么使用 JSX？

- **直观性**：提供了一种视觉上更直观的方式来描述 UI 结构。
- **表达能力**：在标记中可以直接使用 JavaScript 的强大功能。
- **React 生态标准**：虽然可以用纯 JS (`React.createElement`) 写 React，但 JSX 是社区主流和推荐的方式。

#### 3. JSX 的基本规则和语法

**a. 基本写法：看起来像 HTML**

```tsx
const element = <h1>Hello, world!</h1>;
```

**b. 嵌入 JavaScript 表达式：使用大括号 `{}`**
JSX 内部可以使用任何有效的 JavaScript**表达式**（表达式会产生一个值）。

```tsx
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>; // 输出: Hello, Josh Perez
const element2 = <h1>2 + 2 = {2 + 2}</h1>; // 输出: 2 + 2 = 4
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
const element3 = <h1>Hello, {formatName(user)}!</h1>;
```

**c. JSX 本身也是一个表达式**
编译后，JSX 会变成一个 JavaScript 对象。这意味着你可以：

- 把它赋值给变量。

- 在 `if` 语句和 `for` 循环中使用它。

- 从函数中返回它。

- 将其作为参数接收。

  ```tsx
  function getGreeting(user) {
    if (user) {
      return <h1>Hello, {formatName(user)}!</h1>;
    }
    return <h1>Hello, Stranger.</h1>;
  }
  ```

**d. 指定属性：使用引号（字符串）或大括号（表达式）**

- **字符串字面量**：使用引号。

  ```tsx
  const element = <div tabIndex="0"></div>;
  ```

- **JavaScript 表达式**：使用大括号。

  ```tsx
  const element = <img src={user.avatarUrl}></img>;
  ```

  **注意**：要么用引号（字符串），要么用大括号（表达式），**不能同时使用两者**。例如 `src=“{user.avatarUrl}”` 会传递一个字符串 `"{user.avatarUrl}"`，而不是表达式。

**e. 子元素（Children）**

如果标签是空的，你可以像 XML 一样用 `/>` 立即关闭它。

```tsx
const element = <img src={user.avatarUrl} />;
```

标签可以包含子元素：

```tsx
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

**f. 使用 `className` 和 `htmlFor`**
因为 JSX 更接近 JavaScript 而不是 HTML，所以有些属性名是 **小驼峰命名法（camelCase）** 的。

- `class` (HTML) → `className` (JSX)
- `for` (HTML) → `htmlFor` (JSX)

```tsx
// 错误
const element = <div class="my-style"></div>;
// 正确
const element = <div className="my-style"></div>;

// 错误
const element = <label for="nameInput">Name:</label>;
// 正确
const element = <label htmlFor="nameInput">Name:</label>;
```

**g. 必须闭合标签**
所有标签都必须闭合，无论是成对标签还是自闭合标签。

```tsx
// 错误
<br>
<img src="...">
// 正确
<br />
<img src="..." />
```

**h. 防止 XSS 注入攻击**
React DOM 在渲染所有 JSX 之前，会默认转义（escape）其中嵌入的任何值。这意味着它可以有效防止 XSS（跨站脚本）攻击。你无法被注入那些非显式写入你应用程序代码的东西。

## Part 2：Babel 如何转换 JSX 和高级 JS 语法糖

#### 1. Babel 是什么？

- **Babel** 是一个 **JavaScript 编译器**（或称为转译器 - Transpiler）。
- 它的主要作用是**将新版本的 JavaScript 代码（或扩展语法如 JSX）转换为旧浏览器和环境能够兼容的、等效的普通 JavaScript 代码**。

#### 2. Babel 如何处理 JSX？

JSX 浏览器是无法直接理解的。Babel 的核心任务就是将 JSX 语法转换成 `React.createElement()` 函数调用。

**转换前（你写的 JSX）：**

```tsx
const myElement = (
  <div className="container" id="main">
    <h1 style={{ color: 'red' }}>Hello, {name}!</h1>
    <p>This is a paragraph.</p>
  </div>
);
```

**转换后（Babel 输出的标准 JS）：**

```js
"use strict";
const myElement = React.createElement(
  "div", // 标签类型
  { 
    className: "container", 
    id: "main" 
  }, // 属性对象
  React.createElement(
    "h1",
    {
      style: {
        color: 'red'
      }
    },
    "Hello, ", name, "!" // 多个子元素会作为后续参数传入
  ),
  React.createElement(
    "p",
    null, // 如果没有属性，则为 null
    "This is a paragraph."
  )
);
```

- `React.createElement(type, [props], [...children])` 会创建并返回一个**React 元素**，它是一个轻量级的对象，描述屏幕上想要显示的内容。
- React 再读取这些对象来构建 DOM 并保持更新。

#### 3. Babel 如何处理高级 JS 语法糖（ES6+）？

除了 JSX，Babel 还能将现代的 JavaScript 特性（ES2015+/ES6+）转换为兼容性更好的 ES5 代码。

**常见转换示例：**

**a. 箭头函数 (Arrow Functions)**

```js
// 转换前 (ES6+)
const squared = numbers.map(n => n * n);

// 转换后 (ES5)
var squared = numbers.map(function(n) {
  return n * n;
});
```

**b. 解构赋值 (Destructuring Assignment)**

```js
// 转换前 (ES6+)
const { firstName, age } = user;
const [a, b] = [1, 2];

// 转换后 (ES5)
var firstName = user.firstName;
var age = user.age;
var a = 1;
var b = 2;
// (实际转换代码会更复杂以处理各种边缘情况)
```

**c. 模板字符串 (Template Literals)**

```javascript
// 转换前 (ES6+)
const greeting = `Hello, ${name}!`;

// 转换后 (ES5)
var greeting = "Hello, " + name + "!";
```

**d. 类和类字段 (Classes & Class Fields)**

```javascript
// 转换前 (ES6+)
class MyComponent extends React.Component {
  state = { count: 0 }; // 类字段语法
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
}

// 转换后 (ES5) - 简化版
var MyComponent = /*#__PURE__*/function (_React$Component) {
  // ... Babel 会生成复杂的辅助函数来实现继承、方法定义等
  // 状态会被移到构造函数里
  _createClass(MyComponent, [{
    key: "handleClick",
    value: function handleClick() {
      // ...
    }
  }]);
  return MyComponent;
}(React.Component);
```

#### 总结

| 你写的代码 (Source)           | Babel 转换后的代码 (Output)                         | 目的             |
| :---------------------------- | :-------------------------------------------------- | :--------------- |
| `const el = <h1>Hi</h1>;`     | `const el = React.createElement("h1", null, "Hi");` | 让浏览器理解 JSX |
| `const squared = n => n * n;` | `var squared = function(n) { return n * n; };`      | 兼容旧浏览器     |
| `const { name } = obj;`       | `var name = obj.name;`                              | 兼容旧浏览器     |

## Part3：react的父子组件通讯

#### 1.最简父子传参：字符串与数字

父组件

```tsx
// src/pages/Parent.tsx
import Child from '../components/Child';

export default function Parent() {
  return (
    <>
      <Child name="Kimi" age={18} />
      {/* 故意不传 age，看默认值是否生效 */}
      <Child name="Tom" />
    </>
  );
}
```

子组件：接口定义 + 默认值（3 种写法）

```tsx
// src/components/Child.tsx
import React from 'react';

/* 写法 1：接口 + defaultProps（React 官方已不推荐使用） */
interface ChildProps {
  name: string;
  age?: number; // 可选
}

export default function Child({ name, age = 0 }: ChildProps) {
  return (
    <p>
      姓名：{name}，年龄：{age}
    </p>
  );
}

/* 写法 2：默认参数（推荐） */
// 同上，直接解构时给默认值

/* 写法 3：用 ES6 默认参数 + 类型 */
// function Child({ name, age = 0 }: { name: string; age?: number }) { ... }
```

#### 2.回调函数：子→父 通信

父组件

```tsx
// src/pages/Parent.tsx
import { useState } from 'react';
import Counter from '../components/Counter';

export default function Parent() {
  const [val, setVal] = useState(0);

  const handleIncrement = (delta: number) => setVal((v) => v + delta);

  return (
    <>
      <h2>父组件计数：{val}</h2>
      <Counter onIncrement={handleIncrement} />
    </>
  );
}
```

子组件

```tsx
// src/components/Counter.tsx
interface CounterProps {
  onIncrement: (delta: number) => void;
}

export default function Counter({ onIncrement }: CounterProps) {
  return (
    <button onClick={() => onIncrement(2)}>点我 +2</button>
  );
}
```

#### 3.子组件执行完父组件方法后，执行回调函数

1. 极简版：同步返回 boolean

   父组件

   ```tsx
   export default function Parent() {
     const [val, setVal] = useState(0);
   
     // 成功返回 true，失败返回 false
     const handleIncrement = (delta: number): boolean => {
       if (delta <= 0) return false;          // 业务校验失败
       setVal((v) => v + delta);
       return true;                           // 成功
     };
   
     return (
       <>
         <h2>父组件计数：{val}</h2>
         <Counter onIncrement={handleIncrement} />
       </>
     );
   }
   ```

   子组件

   ```tsx
   interface CounterProps {
     onIncrement: (delta: number) => boolean; // ① 改签名
   }
   
   export default function Counter({ onIncrement }: CounterProps) {
     const handleClick = () => {
       const ok = onIncrement(2);
       if (!ok) return;                       // ② 父层失败就停止
       console.log('父层执行成功，子层继续');
       // ... 子层后续逻辑
     };
   
     return <button onClick={handleClick}>点我 +2</button>;
   }
   ```

2. 通用版：返回 `Promise<void>`

   父组件

   ```tsx
   const handleIncrement = async (delta: number): Promise<boolean> => {
     try {
       await new Promise((r) => setTimeout(r, 500)); // 模拟异步
       setVal((v) => v + delta);
       return true;
     } catch {
       return false;
     }
   };
   ```

   子组件

   ```tsx
   interface CounterProps {
     onIncrement: (delta: number) => Promise<boolean>;
   }
   
   export default function Counter({ onIncrement }: CounterProps) {
     const [loading, setLoading] = useState(false);
   
     const handleClick = async () => {
       setLoading(true);
       const ok = await onIncrement(2);
       setLoading(false);
       if (!ok) return;
       console.log('父层异步成功，子层继续');
     };
   
     return (
       <button disabled={loading} onClick={handleClick}>
         {loading ? '处理中...' : '点我 +2'}
       </button>
     );
   }
   ```

3. 完整版：把“后续逻辑”抽成第二个回调（最灵活）

   父组件

   ```tsx
   const handleIncrement = (
     delta: number,
     onSuccess: () => void          // ③ 成功回调由父决定何时执行
   ): void => {
     if (delta <= 0) return;        // 失败就什么都不做
     setVal((v) => v + delta);
     onSuccess();                   // 成功后再调子层后续
   };
   ```

   子组件

   ```tsx
   interface CounterProps {
     onIncrement: (delta: number, onSuccess: () => void) => void;
   }
   
   export default function Counter({ onIncrement }: CounterProps) {
     const doNext = () => console.log('父层成功，子层继续');
   
     return (
       <button onClick={() => onIncrement(2, doNext)}>点我 +2</button>
     );
   }
   ```

#### 3.ReactNode：传递 JSX / 字符串 / 数组

父组件

```tsx
import Card from '../components/Card';

export default function Parent() {
  return (
    <Card
      title={<strong>标题</strong>}
      extra={<button>更多</button>}
    >
      <p>任意嵌套内容</p>
    </Card>
  );
}
```

子组件

```tsx
import { ReactNode } from 'react';

interface CardProps {
  title: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, extra, children }: CardProps) {
  return (
    <section style={{ border: '1px solid #ccc', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{title}</h3>
        <div>{extra}</div>
      </header>
      <main>{children}</main>
    </section>
  );
}
```

**React 的 `children` 就类似于 Vue 的默认插槽（`slot`）**，但：

| 对比点 | React                                                      | Vue                              |
| ------ | ---------------------------------------------------------- | -------------------------------- |
| 名字   | **只能叫 `children`**（关键字）                            | 可以自定义 `<slot name="xxx" />` |
| 类型   | 就是一个 **prop**，类型为 `ReactNode`                      | 编译为虚拟 DOM 的插槽节点        |
| 取值   | 直接解构 `({ children })` 或 `props.children`              | 用 `<slot />` 或 `$slots.xxx`    |
| 多插槽 | 没有“具名插槽”语法，**通过普通 props 传 `ReactNode` 实现** | 有 `<slot name="header" />`      |

#### 4. 为什么只能叫 `children`？

`children` 是 **JSX 语法糖** 的硬编码关键字：

```tsx
<Card>
  <p>abc</p>
</Card>
```

编译后等于

```tsx
React.createElement(Card, {}, React.createElement("p", {}, "abc"))
```

第三个参数就是 `children`，**不可改名**。

#### 5.如果我想实现“具名插槽”怎么办？

React 没有“具名插槽”概念，**直接通过 props 传 `ReactNode`** 即可，官方推荐这样：

```tsx
<Card
  header={<strong>标题</strong>}
  footer={<button>关闭</button>}
>
  <p>默认内容</p>
</Card>
```

子组件：

```tsx
interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ header, footer, children }: CardProps) {
  return (
    <section>
      {header && <header>{header}</header>}
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
```

- `children` **只能叫 `children`**，它是 JSX 的语法糖。
- 想要“具名插槽”效果 → **多定义几个 `ReactNode` 类型的 props** 即可，灵活又类型安全。

#### 6.枚举 + 联合类型：限制传参范围

```tsx
type ButtonSize = 'small' | 'middle' | 'large';
type ButtonType = 'primary' | 'dashed' | 'text';

interface ButtonProps {
  size?: ButtonSize;
  type?: ButtonType;
  onClick?: () => void;
  children: ReactNode;
}

export default function Button({
  size = 'middle',
  type = 'primary',
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${type} btn--${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### 7.泛型组件：列表高阶封装

定义

```tsx
import { ReactNode } from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyFn: (item: T) => React.Key;
}

export default function List<T>({ items, renderItem, keyFn }: ListProps<T>) {
  return <>{items.map((it) => <div key={keyFn(it)}>{renderItem(it)}</div>)}</>;
}
```

使用

```tsx
import List from '../components/List';

interface User {
  id: number;
  name: string;
}

export default function Parent() {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  return (
    <List<User>
      items={users}
      renderItem={(u) => <span>{u.name}</span>}
      keyFn={(u) => u.id}
    />
  );
}
```

#### 8. forwardRef + 泛型：透传 DOM 与自定义 Ref

封装 Input

```tsx
import { forwardRef, Ref } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...rest }, ref: Ref<HTMLInputElement>) => (
    <label>
      {label && <span>{label}</span>}
      <input ref={ref} {...rest} />
    </label>
  ),
);

Input.displayName = 'Input';

export default Input;
```

父组件使用

```tsx
import { useRef } from 'react';
import Input from '../components/Input';

export default function Parent() {
  const ref = useRef<HTMLInputElement>(null);

  const focus = () => ref.current?.focus();

  return (
    <>
      <Input ref={ref} label="用户名" placeholder="请输入" />
      <button onClick={focus}>聚焦</button>
    </>
  );
}
```

为什么自己写的组件拿不到 ref？

函数组件默认不暴露 DOM 节点：

```tsx
const MyInput = () => <input />;
const ref = useRef(null);
<MyInput ref={ref} />   // ❌ 报错：Function components cannot be given refs
```

**解决方案**：用 `forwardRef` 把 ref **透传**给真正的 DOM（或类组件）。

**forwardRef** 的泛型签名长什么样？

```tsx
forwardRef<RefType, PropsType>(render)
```

| 泛型参数    | 含义                                 | 本例取值           |
| ----------- | ------------------------------------ | ------------------ |
| **第 1 个** | 你最终想拿到 **哪种 DOM 节点的引用** | `HTMLInputElement` |
| **第 2 个** | 组件的 **Props 类型**                | `InputProps`       |

因此

```tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => { ... }
);
```

类型声明的 3 种写法（任选其一）

| 写法                     | 场景                     | 代码                                                         |
| ------------------------ | ------------------------ | ------------------------------------------------------------ |
| **① 接口继承**（示例用） | 需要额外字段             | `interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string }` |
| **② 直接交叉**           | 字段很少                 | `type InputProps = { label?: string } & React.InputHTMLAttributes<HTMLInputElement>` |
| **③ 全部自己写**         | 想精简掉不需要的原生属性 | `type InputProps = { label?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; ... }` |

Ref 类型注解的 3 种简写

```tsx
// ① 官方示例写法（最冗余，但最直观）
({ label, ...rest }, ref: Ref<HTMLInputElement>) => ...

// ② 利用类型推断（推荐，最简洁）
(props, ref) => ...        // TS 会自动推断 ref: React.Ref<HTMLInputElement>

// ③ 用 React.ForwardedRef（等价于 ②）
(props, ref: React.ForwardedRef<HTMLInputElement>) => ...
```

#### 9.Context 降级：深层传递避免“props drilling”

这段代码演示了 **React Context 的完整三板斧**：
「创建 → 提供 → 消费」，用来**跨层级传递数据**，避免一层层手动传 props（俗称“props drilling”）。

创建

```tsx
// src/context/theme.ts
import { createContext } from 'react';

export interface Theme {          // ① 先定契约：使用者能拿到什么
  color: string;
  size: 'small' | 'large';
}

export const ThemeContext = createContext<Theme>({
  color: '#1890ff',               // ② 默认值：当组件**找不到 Provider**时用
  size: 'small',
});
```

要点

- `createContext<T>` 的泛型 `T` 就是 **后面 `useContext` 得到的类型**。
- 默认值**不会**被 Provider 的子树使用，只有当组件**不在任何 Provider 里**时才 fallback 到它。
- 把 Context 单独放一个文件，是为了**任何层级的组件都能 import**，而不用通过父组件“层层转发”。

提供

```tsx
import { ThemeContext } from '../context/theme';

export default function Parent() {
  return (
    <ThemeContext.Provider value={{ color: '#f00', size: 'large' }}>
      <DeepTree />                 {/* 里面任意深度都能直接拿到 Theme */}
    </ThemeContext.Provider>
  );
}
```

要点

- `Provider` 像“广播站”，**它本身不渲染任何额外 DOM**，只是把 `value` 放进 React 内部的一张“上下文表”。
- 只要组件在 `Provider` 的子树里，**无论隔多少层**，都能通过 `useContext(ThemeContext)` 拿到 `{ color: '#f00', size: 'large' }`。
- `value` 每次渲染都会**按引用对比**（`Object.is`），如果引用变了，**所有消费组件都会重新渲染**。
  → 因此复杂场景记得用 `useMemo` 或把状态提到 Redux/Zustand 等。

消费

```tsx
import { useContext } from 'react';
import { ThemeContext } from '../context/theme';

export default function DeepChild() {
  const theme = useContext(ThemeContext); // 直接拿到最近的 Provider value
  return <p style={{ color: theme.color }}>深层的文字</p>;
}
```

要点

- `useContext(ThemeContext)` 返回 **离当前组件最近的那个 Provider 的 value**。
- 如果以后需要**多个主题**，可以再建一个 `DarkThemeContext`，互不干扰。
- 想更语义化，可以封装自定义 Hook：

```tsx
// theme.ts 里再加一行
export const useTheme = () => useContext(ThemeContext);

// 使用处
const theme = useTheme();   // 语义更直观
```

一张图记住数据流向

```
Parent (Provider)
│
├─ DeepChild   ——useContext——┐
├─ DeepChild2  ——useContext——┴→ 拿到同一个 value
└─ …（再多层也一样，无需手动传 props）
```

#### 10.实战技巧

1. 接口继承：把“公共 Props”抽成 Base，避免 CV 工程师

   背景
   Button、Input、Card 都需要 `className` 和 `style`，**复制粘贴 100 次**就炸了。

   写法

   ```tsx
   import { CSSProperties } from 'react';
   
   interface BaseProps {          // ① 公共部分
     className?: string;
     style?: CSSProperties;
   }
   
   interface ButtonProps extends BaseProps {  // ② 业务部分
     type?: 'primary' | 'text';
     onClick?: () => void;
   }
   
   const Button: React.FC<ButtonProps> = ({ className, style, type, onClick }) => (
     <button
       className={clsx('btn', `btn--${type}`, className)}
       style={style}
       onClick={onClick}
     />
   );
   ```

   坑点

    - `extends` 是**浅合并**，同名属性**会被子接口覆盖**（利用这个特性可以强行改类型）。
    - 不要 `extends BaseProps & Other`，**交叉类型**会失去“同名覆盖”能力，还可能把可选变必填。

   一句话总结
   **把“所有组件都想要”的Props提到Base，后续extends即可，改1处全项目生效。**

2. Pick / Omit：3 秒拿到“原生按钮所有Props”，但去掉我不想交的

   背景
   你想做一个 `<Btn>`，**保留原生 `<button>` 的所有能力**（onMouseEnter、disabled …），**只把 `type` 这个同名属性顶替掉**。

   写法

   ```tsx
   type NativeBtn = JSX.IntrinsicElements['button']; // ① 原生按钮Props全集
   type BtnProps = Omit<NativeBtn, 'type'> & {       // ② 去掉同名，再叠加自己的
     type?: 'primary' | 'dashed' | 'text';
   };
   
   const Btn = ({ type = 'primary', ...native }: BtnProps) => (
     <button {...native} type="button" className={clsx('btn', `btn--${type}`)} />
   );
   ```

   坑点

    - `Omit` 只能**字符串字面量**key，动态 key 会失效。
    - 如果原生属性是**必填**，Omit 后再叠加**可选**，TS 不会报错，**运行时可能缺字段** → 用 `Pick` 做白名单更保险。

   一句话总结
   **Omit=“黑名单剔除”，Pick=“白名单保留”，两者10秒就能拿到‘官方DOM Props’，再叠自己业务字段。**

3. `typeof` 反推数组 → 联合类型，告别手写联合

   背景
   设计稿给出 3 种尺寸，你**不想手写** `type Size = 'small' | 'middle' | 'large'`，怕后端哪天加字段。

   写法

   ```tsx
   const Size = ['small', 'middle', 'large'] as const;   // ① as const 变成 readonly 元组
   type SizeType = (typeof Size)[number];                // ② 索引访问，得到联合类型
   // SizeType ≡ 'small' | 'middle' | 'large'
   
   // 用在组件里
   interface Props {
     size?: SizeType;
   }
   
   // 还能循环渲染
   export const SizeButtons = () => (
     <>
       {Size.map(s => (
         <button key={s} value={s}>
           {s}
         </button>
       ))}
     </>
   );
   ```

   坑点

    - 忘了 `as const` → `string[]` 会变成 `string`，**联合类型失效**。
    - 数组太长时** TS 编译器会展开联合**，可能出现“type too long”提示，用 `string & {}` 截断即可。

   一句话总结
   **“数组 + as const + typeof 数组[number]” 3 连招，让“值”和“类型”单点维护，永不脱节。**

## Part4：react的兄弟组件通讯

兄弟组件 = **同父同层**的两个（或多个）函数组件
它们**没有直接的 props 通道**，必须通过**公共父级**或**外部容器**做中介。
5 条主流路线：「父级状态回调」、「父级 ref 转发」、「状态管理库」、「Event Emitter」、「Event 」,

#### 1. 核心思路：状态上升（Lifting State Up）

把**共享状态**放到**最近公共父组件**里，再通过 props 分发给兄弟 A、B。
**数据流**：
A 触发事件 → 调父级回调 → 父级 setState → 重新渲染 → B 收到新 props

#### 2. 实战 1：计数器增加 + 日志面板实时显示

目录结构

```
src/
├─ pages/BrotherDemo.tsx   // 公共父级
├─ components/AddCounter.tsx
├─ components/LogPanel.tsx
```

##### 2.1 父组件：状态 + 回调

```tsx
// src/pages/BrotherDemo.tsx
import { useState } from 'react';
import AddCounter from '../components/AddCounter';
import LogPanel from '../components/LogPanel';

export interface Log {
  time: string;
  value: number;
}

export default function BrotherDemo() {
  /* 1. 共享状态 */
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);

  /* 2. 回调：A组件调它 */
  const handleAdd = (delta: number) => {
    const newVal = count + delta;
    setCount(newVal);
    setLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString(), value: newVal },
    ]);
  };

  return (
    <section>
      <h2>兄弟通信 demo（父级状态）</h2>
      <AddCounter onAdd={handleAdd} />
      <LogPanel logs={logs} />
    </section>
  );
}
```

##### 2.2 兄弟 A：负责“+”

```tsx
// src/components/AddCounter.tsx
import { useState } from 'react';

interface AddCounterProps {
  onAdd: (delta: number) => void;
}

export default function AddCounter({ onAdd }: AddCounterProps) {
  const [step, setStep] = useState(1);

  return (
    <div>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        style={{ width: 60 }}
      />
      <button onClick={() => onAdd(step)}>增加</button>
    </div>
  );
}
```

##### 2.3 兄弟 B：负责“看”

```tsx
// src/components/LogPanel.tsx
import { Log } from '../pages/BrotherDemo';

interface LogPanelProps {
  logs: Log[];
}

export default function LogPanel({ logs }: LogPanelProps) {
  return (
    <ul>
      {logs.map((log, idx) => (
        <li key={idx}>
              当前值：{log.value}，时间：{log.time}
        </li>
      ))}
    </ul>
  );
}
```

**运行效果**：
输入框改步长 → 点击“增加” → 父级 `count`/`logs` 更新 → `LogPanel` 实时刷新。

#### 3. 实战 2：父级暴露 ref，兄弟 B 直接调用兄弟 A 的 DOM 方法

场景：
A 是 `Input`，B 是“聚焦按钮”，点击后让 A 聚焦。

思路：

1. 父级创建 `ref`
2. 通过 `forwardRef` 把 ref 透传给 A
3. 再把 ref 通过**自定义 hook** 或** props **传给 B
4. B 直接 `ref.current?.focus()`

##### 3.1 父组件：创建并分发 ref

```tsx
// src/pages/RefBrother.tsx
import { useRef } from 'react';
import Input from '../components/Input';
import FocusButton from '../components/FocusButton';

export default function RefBrother() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input ref={inputRef} />
      <FocusButton inputRef={inputRef} />
    </>
  );
}
```

##### 3.2 兄弟 A：带 forwardRef 的输入框

```tsx
// src/components/Input.tsx
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement>((props, ref) => (
  <input ref={ref} {...props} placeholder="我可以被兄弟聚焦" />
));

Input.displayName = 'Input';
export default Input;
```

##### 3.3 兄弟 B：聚焦按钮

```tsx
// src/components/FocusButton.tsx
import { RefObject } from 'react';

interface FocusButtonProps {
  inputRef: RefObject<HTMLInputElement>;
}

export default function FocusButton({ inputRef }: FocusButtonProps) {
  return (
    <button onClick={() => inputRef.current?.focus()}>兄弟，聚焦！</button>
  );
}
```

#### 4. 实战 3：脱离父级，用小型状态管理库（Zustand）

如果兄弟层级很深、或跨路由，**再抬状态会经过无数中间层** → 用外部 store。

安装

```bash
npm i zustand
```

##### 4.1 创建 store

```tsx
// src/stores/countStore.ts
import { create } from 'zustand';

interface CountState {
  count: number;
  inc: (delta: number) => void;
}

export const useCountStore = create<CountState>((set) => ({
  count: 0,
  inc: (delta) => set((state) => ({ count: state.count + delta })),
}));
```

##### 4.2 兄弟 A：写

```tsx
// src/components/StoreCounter.tsx
import { useCountStore } from '../stores/countStore';

export default function StoreCounter() {
  const inc = useCountStore((s) => s.inc);
  return <button onClick={() => inc(3)}>Store +3</button>;
}
```

##### 4.3 兄弟 B：读

```tsx
// src/components/StoreDisplay.tsx
import { useCountStore } from '../stores/countStore';

export default function StoreDisplay() {
  const count = useCountStore((s) => s.count);
  return <p>Store 计数：{count}</p>;
}
```

**优点**：

- 组件树**零耦合**
- 任意位置、任意深度都能读写
- 自带 selector，渲染粒度可控

#### 5. 实战 4：Event Emitter（发布订阅）—— 完全解耦

场景：两个兄弟**不在同一棵子树**，甚至**异步加载**，用全局事件总线。

安装

```bash
npm i tiny-emitter
```

##### 5.1 封装单例

```tsx
// src/utils/emitter.ts
import Emitter from 'tiny-emitter';
export const emitter = new Emitter();
```

##### 5.2 兄弟 A：发射

```tsx
// src/components/EmitterAdd.tsx
import { emitter } from '../utils/emitter';

export default function EmitterAdd() {
  return (
    <button
      onClick={() => {
        emitter.emit('add', 5);   // 只负责喊，不关心谁听
      }}
    >
      Emitter +5
    </button>
  );
}
```

##### 5.3 兄弟 B：监听

```tsx
// src/components/EmitterDisplay.tsx
import { useEffect, useState } from 'react';
import { emitter } from '../utils/emitter';

export default function EmitterDisplay() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (delta: number) => setCount((c) => c + delta);
    emitter.on('add', handler);
    return () => emitter.off('add', handler); // 必须清理
  }, []);

  return <p>Emitter 计数：{count}</p>;
}
```

**优点**：

- 彻底解耦，**谁先加载谁后加载无所谓**
- 适合**一次订阅多处响应**（toast、日志、埋点）

**缺点**：

- 不受 React 生命周期严格管理，**内存泄漏风险高** → 一定 `off`
- 调试困难，**无单步数据流**

#### 6. 实战 5：window.Event（发布订阅）—— 完全解耦

##### 6.1 父组件

```tsx
import BotherOne from "./BotherOne";
import BotherTwo from "./BotherTwo";


const Correspondence =() =>{
    return(
        <>
            <h2>兄弟组件通信</h2>
            <BotherOne/>
            <BotherTwo/>
        </>
    )
}

export default Correspondence
```

##### 6.2 兄弟组件A：发送事件

```tsx
const BotherOne = () =>{
    const event = new Event('BothOne');
    const clickBother = () =>{
        event.params = { name:'兄弟组件1号' }
        window.dispatchEvent(event);
    }
    return(
        <>
            <h3>我是BotherOne组件</h3>
            <button onClick={clickBother}>发送事件</button>
        </>
    )
}
//扩充event类型
declare global {
    interface Event {
        params?: {
            name: string;
        }
    }
}
export default BotherOne;
```

##### 6.3 兄弟组件B：接受事件

```tsx
const BotherTwo = () =>{
    window.addEventListener('BothOne',(e)=>{
        console.log("我接收到了这个参数",e.params)
    })
    return(
        <>
            <h3>我是BotherTwo组件</h3>

        </>
    )
}
export default BotherTwo;
```

## Part5：同步与异步

同步 = **排队买奶茶**，前面不走你动不了；
异步 = **扫码点单**，先下单再去逛，好了叫你。

#### 1. 同步（Synchronous）

**特点**

- 一行代码没执行完，**后面全部卡住**
- 直观、简单、**阻塞线程**

**常见同步操作**

| 代码                               | 是否同步 | 说明                 |
| ---------------------------------- | -------- | -------------------- |
| `let a = 1 + 2`                    | ✅        | 普通运算             |
| `for (let i = 0; i < 1e9; i++) {}` | ✅        | 巨量循环，页面卡死   |
| `console.log('hi')`                | ✅        | 立即输出             |
| `array.push(1)`                    | ✅        | 内存操作，瞬间完成   |
| `JSON.parse(bigStr)`               | ✅        | 解析大 JSON 会卡界面 |

**体感**：浏览器转圈、动画掉帧、点击无响应。

#### 2. 异步（Asynchronous）

**特点**

- 发起后**立即把控制权交还 JS 主线程**
- 完成后通过**回调 / Promise / async-await / 事件**通知你
- **非阻塞**

**常见异步操作**

| 代码                                 | 是否异步 | 说明             |
| ------------------------------------ | -------- | ---------------- |
| `setTimeout(() => {}, 1000)`         | ✅        | 定时器           |
| `fetch('/api')`                      | ✅        | 网络请求         |
| `fs.readFile` (Node)                 | ✅        | 文件系统         |
| `addEventListener('click', handler)` | ✅        | 事件             |
| `requestAnimationFrame(draw)`        | ✅        | 浏览器重绘前执行 |
| `Promise.then()` / `async await`     | ✅        | Promise 链       |
| `queueMicrotask(() => {})`           | ✅        | 微任务           |
| `WebWorker.postMessage()`            | ✅        | 多线程消息       |

#### 3. 一张图看清执行顺序

```javascript
console.log('A');                 // 1. 同步
setTimeout(() => console.log('B'), 0); // 3. 宏任务（异步）
Promise.resolve().then(() => console.log('C')); // 2. 微任务（异步）
console.log('D');                 // 1. 同步
// 打印顺序：A → D → C → B
```

#### 4. 前端每天遇到的同步 vs 异步

**同步**

- 大量 `for` 循环计算像素
- `JSON.parse` 200 MB 日志
- 递归深拷贝超大对象

→ **页面卡死**，要用 **WebWorker** 或 **分片**改成异步。

**异步**

- 图片懒加载 (`IntersectionObserver`)
- Ajax 拉取数据
- 动画帧 (`requestAnimationFrame`)
- 用户输入防抖 (`setTimeout`)

→ **保持界面流畅**。

------

#### 5. 记忆口诀

> **“运算立即完 = 同步；等会儿再回你 = 异步”**
> 看见 `setTimeout`、`fetch`、`Promise`、`addEventListener` —— **统统异步**，其余大多是同步。

JS 执行队列分 **“调用栈 → 微任务 → 宏任务”** 三层；
当前脚本（同步）先跑完，再清微任务，最后才到宏任务。

#### 6.宏任务和微任务

| 队列                   | 代表                                                       | 优先级                         |
| ---------------------- | ---------------------------------------------------------- | ------------------------------ |
| 1. 调用栈              | 普通同步代码                                               | 立即                           |
| 2. 微任务（MicroTask） | `Promise.then`、`queueMicrotask`、`process.nextTick`(Node) | **栈空后一次性清光**           |
| 3. 宏任务（MacroTask） | `setTimeout`、`setInterval`、`setImmediate`(Node)、I/O     | 每清完一次微任务，取一个宏任务 |

**每执行完一个宏任务，Event Loop 都会把当前微任务队列全部清空**，再去取下一个宏任务。

实验代码

```javascript
console.log('sync-start');                // 1. 同步

setTimeout(() => {                        // 2. 宏1
  console.log('macro-1');
  Promise.resolve().then(() => console.log('micro-inside-macro-1'));
}, 0);

Promise.resolve().then(() => {            // 3. 微1
  console.log('micro-1');
  Promise.resolve().then(() => console.log('micro-1-inner'));
});

setTimeout(() => {                        // 4. 宏2
  console.log('macro-2');
}, 0);

queueMicrotask(() => console.log('micro-2')); // 5. 微2

Promise.resolve().then(() => console.log('micro-3')); // 6. 微3

console.log('sync-end');                  // 7. 同步
```

打印结果

```
sync-start
sync-end
micro-1
micro-1-inner
micro-2
micro-3
macro-1
micro-inside-macro-1
macro-2
```

#### 轮拆解 Event Loop

**初始脚本（同步）**

| 执行                        | 输出                          |
| --------------------------- | ----------------------------- |
| `console.log('sync-start')` | sync-start                    |
| 注册 宏1、宏2               | → 宏任务队列 \[宏1, 宏2]      |
| 注册 微1、微2、微3          | → 微任务队列 \[微1, 微2, 微3] |
| `console.log('sync-end')`   | sync-end                      |

**同步结束 → 清微任务（一次清光）**

| 执行                                            | 输出          |
| ----------------------------------------------- | ------------- |
| 微1                                             | micro-1       |
| 微1 里又注册 **微1-inner** → 扔进当前微任务队列 |               |
| 微1-inner                                       | micro-1-inner |
| 微2                                             | micro-2       |
| 微3                                             | micro-3       |

**宏1 执行完 → 立刻再清一轮微任务**

| 执行                 | 输出                 |
| -------------------- | -------------------- |
| micro-inside-macro-1 | micro-inside-macro-1 |

**微任务又空 → 取下一个宏任务（宏2）**

| 执行                         | 输出    |
| ---------------------------- | ------- |
| `console.log('macro-2')`     | macro-2 |
| 宏2 里没有再注册微任务，结束 |         |

## Part 6：useState用法详解

#### 1. 基本认知

```tsx
const [state, setState] = useState<初始类型>(初始值);
```

- `state` 是**快照**，每次渲染都是**常量**
- `setState` 会**触发重新渲染**（异步批处理）
- 更新函数：`setState(prev => prev + 1)` 是最安全写法，能避开闭包旧值

#### 2. useState 对 **基本类型** 的处理

| 基本类型 | 示例             | 注意                        |
| -------- | ---------------- | --------------------------- |
| number   | `useState(0)`    | 直接 `setCount(c => c + 1)` |
| string   | `useState('')`   | 直接覆盖                    |
| boolean  | `useState(true)` | 切换常用 `setShow(v => !v)` |

完整计数器：

```tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      {/* 推荐写法：函数式更新 */}
      <button onClick={() => setCount(c => c + 1)}>+1 (函数式)</button>
    </>
  );
}
```

**陷阱：闭包**

```tsx
<button onClick={() => setTimeout(() => setCount(count + 1), 1000)}>
  延迟+1（闭包，可能多次点击只+1）
</button>
```

→ 用 `setCount(c => c + 1)` 可拿最新快照

**闭包旧值** = 你在**事件处理函数里直接引用 useState 返回的 state 变量**，但这个函数是在**上一轮渲染时创建的**，所以拿到的是**“那一刻”的旧快照**，而不是最新值。

#### 3. useState 对 **数组** 的处理

**原则**：**禁止直接 push / splice / 通过索引赋值** → 不会触发重渲染

##### 3.1 添加元素

```tsx
const [list, setList] = useState<number[]>([]);

// ✅ 正确：生成新数组
const add = () => setList(prev => [...prev, Date.now()]);

// ❌ 错误
list.push(Date.now());
setList(list);
```

##### 3.2 删除元素

```tsx
const remove = (index: number) =>
  setList(prev => prev.filter((_, i) => i !== index));
```

##### 3.3 更新某个元素

```tsx
const update = (index: number, newVal: number) =>
  setList(prev => prev.map((v, i) => (i === index ? newVal : v)));
```

##### 3.4 批量重置

```tsx
const reset = () => setList([]);
```

**一行代码记忆**：
「数组状态 → 总是 **展开 / 过滤 / 映射** 生成 **新引用**」

#### 4.useState 对 **对象** 的处理

##### 4.1 合并字段（不会自动合并！）

```tsx
const [user, setUser] = useState({ name: 'Tom', age: 18 });

// ✅ 正确：手动合并
const updateName = (name: string) =>
  setUser(prev => ({ ...prev, name }));

// ❌ 错误：丢失 age
setUser({ name });
```

##### 4.2 嵌套对象

```tsx
const [config, setConfig] = useState({
  ui: { theme: 'light', lang: 'zh' },
  api: { timeout: 5000 },
});

// 修改 theme
const setTheme = (theme: string) =>
  setConfig(prev => ({
    ...prev,
    ui: { ...prev.ui, theme },
  }));
```

**技巧**：层数太深 → 用 `immer` 或 `useImmer`

```bash
npm i immer use-immer
```

```tsx
import { useImmer } from 'use-immer';

const [state, setState] = useImmer({ ui: { theme: 'light' } });

// 直接“ mutable ”语法，immer 帮你生成新对象
const setTheme = (theme: string) =>
  setState(draft => {
    draft.ui.theme = theme;
  });
```

#### 5. 底层更新机制（面试常问）

##### 5.1 流程图（文字版）

```
1. 调用 setState(newState)
2. React 把更新对象（update）放入组件** fiber 节点的更新队列**
3. 请求调度（scheduleWork）→ 批处理（batching）
4. 渲染阶段：React 根据队列**计算最新 state**（循环应用函数式更新）
5. 得到新的虚拟 DOM → diff → commit → 真实 DOM 变更
```

##### 5.2 批处理（batching）

React 18 **自动批处理**所有同步 setState
示例：只会渲染一次

```tsx
const handleClick = () => {
  setCount(c => c + 1);
  setFlag(f => !f);   // 两次 setState 合并为一次渲染
};
```

##### 5.3 函数式更新优势

```tsx
setCount(c => c + 1); 
```

##### 5.4 队列顺序演示

```tsx
const [n, setN] = useState(0);
setN(n + 1);   // 0 → 1
setN(n + 1);   // 0 → 1 （闭包）
setN(c => c + 1); // 1 → 2 （函数式）
// 最终 n === 2
```

## Part7:useEffect用法详解

#### 1.纯函数和副作用函数

| 类型           | 定义口诀                            | 举例                                  |
| -------------- | ----------------------------------- | ------------------------------------- |
| **纯函数**     | 相同输入→相同输出，**不碰外部世界** | `(a, b) => a + b`                     |
| **副作用函数** | 执行时**对外部世界产生可观察变化**  | `console.log`、DOM 操作、Ajax、定时器 |

##### 1. 纯函数（Pure Function）

**三要素**

1. **无副作用**——不修改外部变量、不打印、不请求、不改 DOM
2. **引用透明**——相同输入永远相同输出
3. **不依赖外部可变状态**

React 里最典型例子：

```tsx
// 纯组件：props 一样，渲染结果永远一样
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}

// 纯工具
const add = (a: number, b: number) => a + b;
```

**优点**：易测试、易缓存、可时间旅行调试。

##### 2. 副作用（Side Effect）

凡是**“函数执行后，函数体之外的世界变了”**都叫副作用。
在 React 里常见场景：

| 副作用        | 代码示例                           |
| ------------- | ---------------------------------- |
| 网络请求      | `fetch('/api').then(res => ...)`   |
| 控制台打印    | `console.log('mount')`             |
| DOM 测量/修改 | `element.scrollIntoView()`         |
| 本地存储      | `localStorage.setItem(key, value)` |
| 定时器        | `setTimeout`、`setInterval`        |
| 随机数        | `Math.random()`（每次结果不同）    |
| 全局变量修改  | `window.xxx = ...`                 |

##### 3. React 中的“副作用”落地位置

###### ① 组件外 → 随便写

```tsx
utils/api.ts 里 export const getUser = () => fetch('/user');
```

###### ② 组件内 → **必须放在 useEffect（或事件回调）里**

```tsx
useEffect(() => {
  // 这里集中写所有副作用
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer); // 清理
}, []);
```

##### 4. 基本签名

```tsx
useEffect(effect: () => (void | (() => void)), deps?: ReadonlyArray<any>)
```

- **effect**：副作用函数；可返回**清理函数**
- **deps**：依赖数组；变化才重新执行
- **执行时机**：渲染完成 → 浏览器绘制**之后**（不会阻塞帧）

#### 2.生命周期对照图（类组件 → 函数组件）

| 类组件生命周期         | useEffect 等价                             |
| ---------------------- | ------------------------------------------ |
| `componentDidMount`    | `useEffect(() => {}, [])`                  |
| `componentDidUpdate`   | `useEffect(() => {})` （无依赖或含依赖）   |
| `componentWillUnmount` | `useEffect(() => { return () => {} }, [])` |

#### 3.实战 1：挂载 & 卸载（仅运行一次）

需求：组件出现 3 秒后弹提示，卸载时清掉定时器

```tsx
import { useEffect } from 'react';

export default function TimerBanner() {
  useEffect(() => {
    const timer = setTimeout(() => alert('3s 到了'), 3000);

    // 清理函数 = componentWillUnmount
    return () => clearTimeout(timer);
  }, []); // 空数组 → 只运行一次

  return <div>我出现了，3 秒后弹窗</div>;
}
```

关键点

- 空依赖 `[]` → **“didMount & willUnmount”**语义
- 清理函数在**下次 effect 执行前**或**组件卸载时**被调用

#### 4. 实战 2：依赖监听（更新时也会跑）

需求：关键词变化自动拉数据

```tsx
import { useEffect, useState } from 'react';

export default function SearchResults({ keyword }: { keyword: string }) {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 空关键词不查
    if (!keyword) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${keyword}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setList(data.items))
      .finally(() => setLoading(false));

    // 清理：取消过时请求 + 卸组件时中断
    return () => controller.abort();
  }, [keyword]); // 只要 keyword 变化就重新执行

  return loading ? (
    <p>Loading...</p>
  ) : (
    <ul>{list.map((v) => <li key={v}>{v}</li>)}</ul>
  );
}
```

**关键点**

- 依赖数组**逐项浅比较**；引用类型要**稳态**（见第 6 节）
- 清理函数可取消定时器、网络请求、订阅，防止**内存泄漏 & 竞态**

#### 5.实战 3：无依赖 = 每次渲染后都跑

```tsx
useEffect(() => {
  console.log('组件每次渲染完都会进来');
});
```

用于：**调试、打日志、与外部库同步 DOM 尺寸**等

#### 6. 性能陷阱：引用类型依赖

```tsx
const [filters, setFilters] = useState({ type: 'all' });

useEffect(() => {
  fetchData(filters);
}, [filters]);          // 每次渲染都新对象 → 死循环
```

**解决 1：把依赖拆成基础类型**

```tsx
useEffect(() => {
  fetchData(filters);
}, [filters.type]);     // string 稳定
```

**解决 2：useMemo 稳态对象**

```tsx
const filters = useMemo(() => ({ type: 'all' }), []);
```

#### 7. 异步函数直接写？不行！

effect 回调**不能是 async 函数**，因为返回的是 Promise，React 无法拿到清理函数。

**正确姿势：在内部定义并立即调用**

```tsx
useEffect(() => {
  const load = async () => {
    const data = await fetch('/api').then((r) => r.json());
    setData(data);
  };
  load();
}, []);
```

#### 8.清理函数执行时机

| 场景                             | 清理函数触发 |
| -------------------------------- | ------------ |
| 依赖变化，**重新运行 effect 前** | ✅            |
| 组件卸载                         | ✅            |
| 依赖未变，仅父组件重渲染         | ❌            |

#### 9.进阶：深比较依赖（可选）

```tsx
import { useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

function useDeepCompareEffect(effect: () => void | (() => void), deps: any[]) {
  const ref = useRef<any>();

  if (!isEqual(ref.current, deps)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
}
```

修改性能陷阱的地方

```tsx
useDeepCompareEffect(() => {
  fetchData(filters);
}, [filters]);
```

**“空数组只一次，无依赖次次进，有依赖变化才 rerun；**
**返回函数做清理，异步写在里边，引用不稳就拆浅。”**

## Part8:useLayoutEffect用法详解

useLayoutEffect 是React 中的hook，用于在浏览器重新绘制屏幕之前触发，与useEffect类似

#### 1.基础定义

```tsx
useLayoutEffect(effect: () => (void | (() => void)), deps?: ReadonlyArray<any>)
```

- 签名与 `useEffect` **一模一样**
- **区别**：执行时机不同
    - `useEffect` → **浏览器绘制后**（异步，不阻塞帧）
    - `useLayoutEffect` → **浏览器绘制前**（同步，**阻塞帧**）

#### 2.为什么要绘制前

需求：
**避免闪屏** —— 先让 React 把真实 DOM 算好，**同步改掉样式/位置**，再一次性画到屏幕上，用户看不到中间态。

#### 3. 生命周期对照图

```
渲染完成 → useLayoutEffect 执行（同步） → 浏览器正式绘制 → useEffect 执行
```

若 `useLayoutEffect` 里改 DOM → 本次帧直接带上最终样式，**不会闪烁**。

#### 4.实战 1：tooltip 自动定位（防止跳动）

需求：
按钮渲染后，测量 tooltip 宽度，若超出视口则向左显示。

```tsx
import { useRef, useState, useLayoutEffect } from 'react';

export default function TooltipButton() {
  const [left, setLeft] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    // DOM 已生成，但浏览器还没画出来
    const btn = btnRef.current!;
    const tooltipWidth = 150; // 已知样式写死宽度
    const rightEdge = btn.getBoundingClientRect().right + tooltipWidth;
    const viewportWidth = window.innerWidth;

    if (rightEdge > viewportWidth) {
      setLeft(btn.offsetLeft - tooltipWidth); // 移到左边
    } else {
      setLeft(btn.offsetLeft); // 默认右边
    }
    // 浏览器接下来绘制的是“已经修正”的位置 → 用户看不到跳动
  }, []); // 只跑一次

  return (
    <>
      <button ref={btnRef} style={{ marginLeft: 200 }}>
        悬停我
      </button>
      <div
        style={{
          position: 'absolute',
          top: btnRef.current?.offsetTop,
          left,
          width: 150,
          background: '#333',
          color: '#fff',
        }}
      >
        提示文字
      </div>
    </>
  );
}
```

**关键点**

- 若用 `useEffect` → 先看到 tooltip 在右边闪一下，再跳到左边
- 用 `useLayoutEffect` → **同一帧内**完成测量+修正，**零闪屏**

#### 5.实战 2：动态获取元素高度做平滑展开（accordion）

```tsx
import { useState, useRef, useLayoutEffect } from 'react';

export default function Accordion() {
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    // 浏览器绘制前拿到“真实内容高度”
    const fullHeight = contentRef.current?.scrollHeight ?? 0;
    setHeight(open ? fullHeight : 0);
  }, [open]); // 开关变化就重新测量

  return (
    <>
      <button onClick={() => setOpen(v => !v)}>Toggle</button>
      <div
        style={{
          height,
          overflow: 'hidden',
          transition: 'height 300ms',
          background: '#f5f5f5',
        }}
      >
        <div ref={contentRef}>
          <p>任意内容</p>
          <p>高度不确定</p>
        </div>
      </div>
    </>
  );
}
```

#### 6.性能陷阱：阻塞帧

`useLayoutEffect` **同步执行**，长任务会**掉帧**：

```tsx
// ❌ 耗时计算放这里 → 页面卡顿
useLayoutEffect(() => {
  const arr = Array.from({ length: 1e6 }, (_, i) => i * i);
  setBigArr(arr);
}, []);
```

→ **仅做“必须同步”的 DOM 测量/修改**，其余放 `useEffect` 或 `requestIdleCallback`

#### 7.与 useEffect 选择决策树

```tsx
├─ 需要测量/改动 DOM 并**立即呈现**，不能闪屏 → useLayoutEffect
├─ 网络请求、日志、订阅等**可延后**任务 → useEffect
└─ 不确定 → **先用 useEffect**，有问题再换
```

#### 8.服务端渲染（SSR）注意

Node 环境没有 DOM，**useLayoutEffect 不会执行**。
若代码依赖 DOM 测量，需加兜底：

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
return mounted ? <RealComponent /> : <Placeholder />;
```

#### 9. 清理函数时机（同 useEffect）

| 场景                         | 清理函数触发 |
| ---------------------------- | ------------ |
| 依赖变化，重新执行 effect 前 | ✅            |
| 组件卸载                     | ✅            |

#### 10. 口诀记忆

> **“Effect 后绘制，LayoutEffect 前；**
> **测 DOM、防闪屏，长任务别放里边；**
> **不确定就 Effect，卡顿再换 Layout 前。”**

## Part9:useReducer

`useReducer`是React提供的一个高级Hook，没有它我们也可以正常开发，但是`useReducer`可以使我们的代码具有更好的可读性，可维护性。

`useReducer` 跟 `useState`一样的都是帮我们管理组件的状态，但是与`useState`不同的是`useReducer`是集中式的管理状态

#### 1. 基础签名与概念

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

| 参数         | 说明                                           |
| ------------ | ---------------------------------------------- |
| `reducer`    | `(state, action) => newState` **纯函数**       |
| `initialArg` | 初始值（或传给 `init` 的形参）                 |
| `init`       | **可选**惰性初始化函数 `(arg) => initialState` |

**返回**

- `state`：当前状态
- `dispatch(action)`：触发更新（**异步批处理**，与 `setState` 类似）

#### 2.实战例子：useReducer VS useState 计数器

**useState**

```tsx
import {useState} from "react";

const UseReducerPart = () => {

    const [count,setCount]=useState(0)
    return (
        <>
            <h2>
                ----------useReducer的用法--------
            </h2>
            <p>当前计数：{count}</p>
            <button onClick={()=>setCount(count+1)}>+1</button>
            <button onClick={()=>setCount(count-1)}>-1</button>
        </>
    )
}

export default UseReducerPart
```

**useReducer**

```tsx
import {useReducer, useState} from "react";

type Action = { type: 'inc' } | { type: 'dec' } | {type:'add';payload:number}

const reducer = (state:number, action: Action)=>{
    switch (action.type){
        case'inc':
            return state + 1;
        case 'dec':
            return state - 1;
        case 'add':
            return state + action.payload;
        default:
            throw new Error('Unknown action');
    }
}
const UseReducerPart = () => {

    const [count,setCount]=useState(0)

    const [countData,dispatch] = useReducer(reducer,0);
    return (
        <>
            <h2>
                ----------useReducer的用法--------
            </h2>
            <p>当前计数：{count}</p>
            <button onClick={()=>setCount(count+1)}>+1</button>
            <button onClick={()=>setCount(count-1)}>-1</button>

            <h2>使用useReducer实现计数器</h2>
            <p>当前计数：{countData}</p>
            <button onClick={()=>dispatch({type:'inc'})}>+1</button>
            <button onClick={()=>dispatch({type:'dec'})}>-1</button>
            <button onClick={()=>dispatch({type:'add',payload:count})}>+{count}</button>
        </>
    )
}

export default UseReducerPart
```

**关键点**

- `reducer` 必须是**纯函数**：无 mutate、无副作用、可预测
- `dispatch` 只接受一个**普通对象**（action）

#### 3.复杂状态：表单注册

```tsx
import React, {useEffect, useReducer} from "react";

interface FormState {
    name: string;
    age: number;
    errors: { name?: string; age?: string },
    submitted:boolean;
}

type FormAction =
    | { type: 'setName'; payload: string }
    | { type: 'setAge'; payload: string }
    | { type: 'validate' }
    | { type: 'resetSubmitted' }

const initialState: FormState = {name: '', age: 0, errors: {},submitted:false}

const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
        case 'setName':
            return {...state, name: action.payload};
        case 'setAge': {
            const age = Number(action.payload);
            return {...state, age};
        }
        case 'validate': {
            const errors: FormState['errors'] = {};
            if (!state.name.trim()) errors.name = '必填';
            if (state.age < 18) errors.age = '必须≥18';

            return { ...state, errors, submitted: true };
        }
        case 'resetSubmitted':
            return { ...state, submitted: false };
        default:
            throw new Error()
    }
}
const FormPart = () => {
    const [ state,dispatch ] = useReducer(formReducer,initialState)

    const handleSubmit =async (e: React.FormEvent) =>{
        e.preventDefault()
        dispatch({ type:'validate' });
    }
    useEffect(() => {
        if (!state.submitted) return;
        if (state.errors.name || state.errors.age) return;
        alert('提交成功');
        dispatch({ type: 'resetSubmitted' });
    }, [state.errors, state.submitted]);

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input
                    value={state.name}
                    onChange={e => dispatch({ type: 'setName', payload: e.target.value })}
                    placeholder="姓名" />
                { state.errors.name && <span>{state.errors.name}</span> }
                <input
                    type="number"
                    value={state.age ||''}
                    onChange={e => dispatch({type:'setAge',payload:e.target.value})}
                    placeholder="年龄" />
                { state.errors.age && <span>{state.errors.age}</span> }

                <button type='submit'>注册</button>
            </form>
        </>
    )
}

export default FormPart;
```

**好处**

- 所有表单逻辑收进 reducer，组件只负责事件转发
- 易单元测试：`expect(formReducer(state, action)).toEqual(newState)`

#### 4.实战例子，购物车的实现

```tsx
import {useReducer} from "react";

const initData =[{
    id:1,
    name:'张三',
    price:9.9,
    count: 1,
    isEdit:false,
},{
    id:2,
    name:'李四',
    price:8,
    count:1,
    isEdit: false
},{
    id:3,
    name:'王五',
    price:5,
    count:1,
    isEdit:false
}]
type State = typeof initData;
const reducer = (state: State,action:{type:string;id:number,newName?:string}) => {
    const item = state.find((v)=>v.id === action.id)!;
    switch (action.type) {
        case 'add':
            item.count++;
            return [...state];
        case 'sub':
            item.count--;
            return [...state];
        case 'del':
            return state.filter(v=>v.id!==action.id);
        case 'edit':
            item.isEdit = !item.isEdit;
             return [...state];
        case 'blur':
            item.isEdit = false;
            return [...state];
        case 'edit-name':
            if(action.newName){
                item.name = action.newName;
            }
            return [...state];
        default:
            return state;
    }
}
const ShoppingCart = () => {
    const [data,dispatch] = useReducer(reducer,initData);
    return(
        <>
            <h1>购物车</h1>
            <table cellSpacing={0} cellPadding={0} border={1} width={"100%"}>
                <thead>
                    <tr>
                        <th>商品名称</th>
                        <th>单价</th>
                        <th>数量</th>
                        <th>总价</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data.map((item)=>{
                        return (
                            <tr key={item.id}>
                                <td align={"center"}>
                                    { item.isEdit ? <input onBlur={()=>dispatch({type:'blur',id:item.id})} onChange={(e)=>dispatch({type:'edit-name',id:item.id,newName:e.target.value})} value={item.name} type={'text'}/>:item.name }
                                </td>
                                <td align={"center"}>{item.price}</td>
                                <td align={"center"}>
                                    <button onClick={()=>dispatch({type:'sub',id:item.id})}>-</button>
                                    {item.count}
                                    <button onClick={()=>dispatch({type:'add',id:item.id})}>+</button>
                                </td>
                                <td align={"center"}>{item.price*item.count}</td>
                                <td align={"center"}>
                                    <button onClick={()=>dispatch({type:'edit',id:item.id})}>编辑</button>
                                    <button onClick={()=>dispatch({type:'del',id:item.id})}>删除</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}>总价</td>
                        <td align={"center"}>
                            结算:{' '}
                            {
                                data.reduce((pre,cur)=>{
                                    return pre + cur.price * cur.count;
                                },0)
                            }
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}

export default ShoppingCart;
```

#### 5.异步逻辑：useReducer + useEffect 拉数据

需求：列表页 **loading → success/error**
把“请求状态”也收进 reducer

```tsx
import { useReducer, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string };

type Action =
  | { type: 'fetch' }
  | { type: 'ok'; payload: User[] }
  | { type: 'fail'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'fetch':
      return { status: 'loading' };
    case 'ok':
      return { status: 'success', data: action.payload };
    case 'fail':
      return { status: 'error', message: action.payload };
    default:
      return state;
  }
};

export default function UserList() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  useEffect(() => {
    dispatch({ type: 'fetch' });
    fetch('/api/users')
      .then((r) => r.json())
      .then((data: User[]) => dispatch({ type: 'ok', payload: data }))
      .catch((e: Error) => dispatch({ type: 'fail', payload: e.message }));
  }, []);

  switch (state.status) {
    case 'idle':
    case 'loading':
      return <p>Loading...</p>;
    case 'success':
      return (
        <ul>
          {state.data.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      );
    case 'error':
      return <p style={{ color: 'red' }}>{state.message}</p>;
  }
}
```

**关键点**

- reducer 里**不写副作用**（不 fetch），只负责**状态转换**
- 副作用放在 `useEffect` 中，再通过 dispatch 把结果发回去

## Part10:`useSyncExternalStore`的用法

#### 1.为什么诞生（痛点回顾）

| 场景                               | useState                       | useEffect          | 结果     |
| ---------------------------------- | ------------------------------ | ------------------ | -------- |
| 浏览器 API（online/resize/scroll） | ❌ 需要手动 addListener         | ✅ 但异步，可能闪屏 | 体验差   |
| 全局状态（Redux/MobX）             | ❌ 多次渲染不一致（Concurrent） | ❌ 同样异步         | 并发撕裂 |
| SSR                                | ❌ 前后快照不同                 | ❌ 不跑             | 水合错误 |

**→ useSyncExternalStore 统一解决：**

- **同步**读取外部值
- **自动**订阅 / 卸载
- **兼容** Concurrent & SSR
- **官方背书**（React 18 稳定 API）

#### 2. 基础签名（TS 泛型版）

```tsx
const snapshot = useSyncExternalStore(
  subscribe,   // (callback) => () => void
  getSnapshot, // () => T
  getServerSnapshot?, // () => T（SSR 用，可选）
);
```

| 参数                | 说明                                                       |
| ------------------- | ---------------------------------------------------------- |
| `subscribe`         | 注册监听器；当外部值变化时**必须调用 callback** 通知 React |
| `getSnapshot`       | **同步**返回当前值；必须**不可变**且\*\*=== 稳定\*\*       |
| `getServerSnapshot` | SSR 时第一次水合用；若省略则客户端需与服务器值一致         |

#### 3.分装一个浏览器路由hooks

```ts
import {useSyncExternalStore} from "react";

export const useHistory = () =>{
    const subscribe = (callback:()=>void) => {
        //订阅浏览器api
        //vue 三种路由结构 ssr 浏览器-hash history
        //hash 底层 监听hashchange事件
        //history 底层 监听popstate事件
        window.addEventListener('popstate',callback);
        window.addEventListener('hashchange',callback);
        return () => {
            //取消订阅
            window.removeEventListener('popstate',callback);
            window.removeEventListener('hashchange',callback);
        }
    }
    const getSnapshot = () =>{
        return window.location.href;
    }
    const url = useSyncExternalStore(subscribe, getSnapshot);
    const push = (url:string)=>{
        //跳转
        window.history.pushState({},'',url);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
    const replace = (url:string)=>{
        //替换
        window.history.replaceState({},'',url);
        window.dispatchEvent(new PopStateEvent('replace'));
    }
    return [url,push,replace] as const;
}
```

## Part11:`useTransition`的用法

`useTransition` 让你在「高优先级交互」与「低优先级渲染」之间做出取舍：既不阻塞用户输入，又能优雅地把重计算/重渲染放到后台执行。

#### 1. 为什么会出现 useTransition？

| 场景                    | 痛点                                   |
| ----------------------- | -------------------------------------- |
| 搜索框实时过滤 1w+ 列表 | 每输入一个字符就卡顿 200 ms            |
| Tab 切换挂载重组件      | 点击后 400 ms 才响应，用户以为“没点到” |
| 图表、看板、Tree 展开   | 动画掉帧，主线程被 React 渲染占满      |

React 18 之前我们只能手动 `debounce`/`setTimeout`，但「延迟多久」是魔法数字，且无法感知 React 渲染队列。
`useTransition` 把“优先级”概念交给 React 调度器，**可中断、可恢复、可感知状态**。

#### 2. API 一览

```tsx
const [isPending, startTransition] = useTransition();
```

| 返回值            | 类型                          | 含义                                            |
| ----------------- | ----------------------------- | ----------------------------------------------- |
| `isPending`       | `boolean`                     | 过渡是否仍在进行（可用来展示 Loading 样式）     |
| `startTransition` | `(scope: () => void) => void` | 把 `scope` 里的所有 **setState** 标记为低优先级 |

注意：`startTransition` 只能包裹 **同步** 的 `setState`；异步代码（fetch、Promise）需要先用同步 `setState` 把数据写进 state，再 `startTransition` 触发渲染。

#### 3. 心智模型：「两条赛道」

1. 高优先级赛道（默认）
   用户输入、点击、滚动、动画 → 立即 commit。
2. 低优先级赛道（Transition）
   大数据列表、路由切页、复杂图表 → 时间切片执行，**可被高优先级任务打断**。

#### 4.useTransition开发一个vite插件

```ts
import {defineConfig, type Plugin} from 'vite'
import react from '@vitejs/plugin-react-swc'
import url from "node:url"
import mockjs from 'mockjs'

//vite插件
const viteMockServer = (): Plugin => {
    return {
        name: 'vite-plugin-mock',
        configureServer(server) {
            // 1. 只匹配路径
            server.middlewares.use('/api/mock/list', (req, res) => {
                // 2. 解析 query
                const { query } = url.parse(req.originalUrl, true);
                const key = query.key || 'default'; // 给个兜底值

                res.setHeader('Content-Type', 'application/json');
                const data = mockjs.mock({
                    'list|2000': [{
                        id: '@guid',
                        name: key,
                        age: '@integer(18,60)',
                        address: '@county(true)',
                    }]
                });
                res.end(JSON.stringify(data));
            });
        }
    };
};
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),viteMockServer()],
})

```

```tsx
import {useState, useTransition} from "react";
import {Input, List} from "antd";

interface Iitem{
    id: string;
    name: string;
    age: number;
    address: string;
}

const UseTransitionPart = () =>{
    const [inputValue, setInputValue] = useState('');
    const [list,setList] = useState<Iitem[]>([])
    const [isPending,startTransition] = useTransition();
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const resValue = e.target.value;
        setInputValue(resValue);
        fetch('/api/mock/list?key='+resValue)
            .then(res => res.json())
            .then(data => {
                startTransition(()=>{
                    setList(data.list)
                })
            });
    }
    return (
        <>
            <Input value={inputValue} onChange={handleChange} />
            {isPending && <div>加载中...</div>}
            <List dataSource={list}  renderItem={(item)=><List.Item>{item.address}</List.Item>}/>
        </>
    )
}

export default UseTransitionPart;
```

## Part12：usedeferred的用法详解

把「某个值」标记为**低优先级**，让 React **先复用旧值渲染一遍**，再在后台时间切片更新为新值，从而**避免阻塞高优任务**（输入、动画、滚动）。

#### 1. 出现背景（为什么有它？）

| 场景                     | 无并发特性痛点               | useDeferredValue 解决思路              |
| ------------------------ | ---------------------------- | -------------------------------------- |
| 搜索框实时过滤 2w 条数据 | 每输入一帧需 180ms，键盘卡死 | 先用旧列表渲染，后台再计算新列表       |
| 图表随滑块实时重算       | 滑块掉帧 15fps               | 图表拿到「延迟值」，滑块保持 60fps     |
| 父组件传巨大对象给子组件 | 子组件 render 耗时 100ms     | 子组件对「延迟值」memo，父组件立即响应 |

#### 2. API 签名与语义

```tsx
const deferredValue = useDeferredValue<T>(value: T, options?: { timeoutMs?: number });
```

| 参数      | 说明                               |
| --------- | ---------------------------------- |
| `value`   | **高优最新值**（通常来自受控输入） |
| `options` | 官方暂未开放 `timeoutMs`，保留位   |

| 返回值          | 说明                                                     |
| --------------- | -------------------------------------------------------- |
| `deferredValue` | 在**后台更新**完成前，等于**旧值**；完成后等于**最新值** |

与 `useTransition` 区别：

- `useTransition` 是「把 setState 标记为低优」
- `useDeferredValue` 是「把某个值标记为低优」

#### 3. 心智模型：「两张快照」

1. **高优快照**（commit 1）
   输入框、滑块等立即使用 `value`，保证 UI 不阻塞。
2. **低优快照**（commit 2…n）
   重组件使用 `deferredValue`，React 在空闲时间切片逐步完成。

#### 4. 最小可运行示例（搜索过滤）

```tsx
import {memo, useDeferredValue, useState} from "react";


interface ListProps {
    query: string;
}
const LIST = Array.from({ length: 30000 }, (_, i) => `Item-${i}`);

// 重组件：memo + deferredValue
const List = memo(function List({ query }:ListProps) {
    console.log('[List] render', query);
    const filtered = LIST.filter(v => v.includes(query));
    return (
        <ul>
            {filtered.slice(0, 100).map(v => <li key={v}>{v}</li>)}
        </ul>
    );
});

const UseDeferredValuePart = () =>{
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    return (
        <>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="type to search"
            />
            <span style={{ marginLeft: 8 }}>
                {deferredQuery !== query && '⏳'}
            </span>
            <List query={deferredQuery} />
        </>
    );
}
export default UseDeferredValuePart;
```

**效果**：

- 输入瞬间响应，列表先显示旧结果，右上角出现「⏳」；
- 后台计算完毕后「⏳」消失，列表更新为新结果。

#### 5、路由切换保持 UI 不空白

```tsx
function Page({ location }) {
  // 先用旧 location 渲染，后台再切新页面
  const deferredLoc = useDeferredValue(location);
  return (
    <Suspense fallback={<Spinner />}>
      <AsyncPage loc={deferredLoc} />
    </Suspense>
  );
}
```

## Part13：`useRef` 笔记

#### 1.`useRef` 完全学习笔记

```tsx
const ref = useRef<T>(initialValue);
```

- 返回一个 **可变的普通对象**：`{ current: T }`
- **改变 `current` 不会触发重新渲染**（区别于 `useState`）
- 生命周期：每次渲染**返回同一个 ref 对象**（地址不变）

#### 2.三大核心用途

| 用途         | 典型场景                        | 代码示例                                      |
| ------------ | ------------------------------- | --------------------------------------------- |
| ① 保存可变值 | 计时器 id、计数器、任意可变数据 | `ref.current = setTimeout(...)`               |
| ② 获取 DOM   | 聚焦、滚动、测量尺寸            | `ref={inputRef}` + `inputRef.current.focus()` |
| ③ 缓存数据   | 保存上一次 props/state、防抖值  | `prevPropsRef.current = props`                |

#### 3. 实战 1：受控组件聚焦

```tsx
import { useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => inputRef.current?.focus();

  return (
    <>
      <input ref={inputRef} placeholder="我会被聚焦" />
      <button onClick={focus}>聚焦</button>
    </>
  );
}
```

**关键点**

- `ref={inputRef}` 把真实 DOM 节点放进 `inputRef.current`
- 组件卸载时 `current` 自动变为 `null`

#### 4. 实战 2：保存计时器 id（不触发渲染）

```tsx
import { useRef, useEffect } from 'react';

export default function Timer() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => console.log('tick'), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return <button onClick={stop}>停止计时器</button>;
}
```

**好处**

- 计时器 id **不需要渲染**，放 ref 避免多余重渲染
- 清理函数里也能读到最新 id

#### 5. 实战 3：保存上一次值（自定义 Hook）

```tsx
import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const prevRef = useRef<T>();
  useEffect(() => {
    prevRef.current = value; // 渲染完成后记录
  });
  return prevRef.current;
}

// 使用
export default function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前：{count}，上一次：{prevCount ?? '无'}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
```

#### 6. 实战 4：测量 DOM 尺寸（避免闪屏）

```tsx
import { useRef, useLayoutEffect } from 'react';

export default function MeasureDiv() {
  const divRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useLayoutEffect(() => {
    // 浏览器绘制前测量，不会闪
    const el = divRef.current!;
    sizeRef.current = { width: el.offsetWidth, height: el.offsetHeight };
    console.log('尺寸', sizeRef.current);
  });

  return (
    <div ref={divRef} style={{ resize: 'both', overflow: 'scroll', border: '1px solid' }}>
      拖动右下角改变大小
    </div>
  );
}
```

#### 7. 进阶：forwardRef 透传 DOM

- `useRef` **是 Hook**，用来“创建一个可变的 ref 对象”
- `forwardRef` **是高阶组件工厂**，用来“把父组件传下来的 ref 转发到子组件内部的 DOM 或自定义实例”
  → 两者**不是竞争关系**，而是**配合使用**：`forwardRef` 负责**透传**，`useRef` 负责**持有**。

| 角色         | 类型       | 作用                                                 | 本例中的位置      |
| ------------ | ---------- | ---------------------------------------------------- | ----------------- |
| `useRef`     | Hook       | 在**父组件**端生成一个 ref 对象 `{ current: ... }`   | `Parent` 里       |
| `forwardRef` | 组件包装器 | 让**子组件**能够接收父组件传来的 ref，并挂到内部 DOM | `FancyInput` 外层 |

##### ① 父组件：用 `useRef` 创建“遥控器”

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

- `inputRef` 是一个**普通对象**，属性 `current` 初始为 `null`
- 将来它会被 `<FancyInput ref={inputRef} />` 赋予真实的 `<input>` DOM 节点

##### ② 子组件：用 `forwardRef` 把“遥控器”插到内部 DOM

```tsx
const FancyInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input ref={ref} {...props} className="fancy" />
));
```

- `forwardRef` 接收**渲染函数**，参数顺序：**(props, ref)**
- 把父组件传下来的 `ref` 挂到内部的 `<input ref={ref} ... />`
- 父组件的 `inputRef.current` 现在就指向这个 `<input>` 了

##### ③ 使用：父组件直接操作子组件里的 DOM

```tsx
<button onClick={() => inputRef.current?.focus()}>聚焦子组件 input</button>
```

示例代码

```tsx
import { forwardRef, useRef } from 'react';

const FancyInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input ref={ref} {...props} className="fancy" />
));

export default function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>聚焦子组件 input</button>
    </>
  );
}
```

#### 8.注意事项

| 陷阱                                    | 正确做法                               |
| --------------------------------------- | -------------------------------------- |
| `ref.current = newValue` 后立刻读 state | 不会触发重渲染，**不要指望 UI 更新**   |
| 在 render 里写 `ref.current = xxx`      | 可以放，但**必须是幂等**操作（如测量） |
| 把 ref 当 key 使用                      | 地址不变，**不能触发重新挂载**         |

## Part14：**useImperativeHandle **用法

useImperativeHandle 让**函数组件**可以通过 ref 暴露一组“命令式方法”（imperative API）给父组件使用。它常用于以下场景：

- 基于原生 DOM 的能力向上暴露能力（如 focus()、scrollTo()）。
- 对第三方非 React 库进行封装（播放器、地图、编辑器等），只给父组件暴露有限 API。
- 在“不想让父组件直接接触内部 DOM”的前提下，提供安全的调用入口。

> 它必须配合 forwardRef 使用；类组件不需要它（类实例本身就能通过 ref 暴露方法）。

#### 1.**useImperativeHandle的函数签名**

React 官方签名（TypeScript）：

```ts
function useImperativeHandle<T, R extends T>(
  ref: React.Ref<T> | undefined,
  createHandle: () => R,
  deps?: React.DependencyList
): void;
```

##### **参数解释：**

| **参数**     | **类型**                     | **是否必填** |                          **说明**                           |
| ------------ | ---------------------------- | ------------ | :---------------------------------------------------------: |
| ref          | `React.Ref<T>`                 | ✅            |   从 forwardRef 传入的 ref，用来让父组件拿到暴露的实例。    |
| createHandle | () => R                      | ✅            |  一个函数，返回**你想暴露给父组件的对象（方法或属性）**。   |
| deps         | React.DependencyList（可选） | ❌            | 控制何时重新创建暴露的对象。和 useMemo / useCallback 类似。 |

#### **2、基本用法示例**

```tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

type Handle = {
  focus: () => void;
};

const MyInput = forwardRef<Handle>((_, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return <input ref={inputRef} />;
});
```

**父组件：**

```tsx
const App = () => {
  const inputRef = React.useRef<Handle>(null);
  return <button onClick={() => inputRef.current?.focus()}>聚焦输入框</button>;
};
```

#### **3、第三个参数deps的作用**

第三个参数类似于 useEffect 或 useMemo 的依赖数组，用来控制何时更新暴露的对象

##### **签名：**

```tsx
useImperativeHandle(ref, createHandle, deps)
```

##### **情况对比：**

| **场景**           | **传入依赖** |                        **发生的效果**                        |
| ------------------ | ------------ | :----------------------------------------------------------: |
| **不传第三个参数** | ❌            | 每次组件重新渲染时都会重新执行 createHandle()，返回新的对象引用。父组件若依赖 ref.current，它可能会频繁变化。 |
| **传入空数组 []**  | ✅            | 只在初次挂载时执行一次，之后不会重新创建暴露对象（最常见）。 |
| **传入依赖项**     | ✅            | 当依赖项变化时重新创建暴露对象（适用于暴露的函数依赖外部 state/props）。 |

##### **🔍 例子 1：不传第三个参数（每次渲染都更新）**

```tsx
useImperativeHandle(ref, () => ({
  getValue: () => state.value
}));
```

⚠️ 每次 state.value 改变都会重新创建一个新对象，即使父组件没用到也会影响性能。

##### **🔍 例子 2：传空数组（稳定引用）**

```tsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current?.focus(),
}), []);
```

✅ handle 对象只创建一次，稳定高效。

内部方法通过闭包访问 ref，能获取到最新 DOM 引用。

##### **🔍 例子 3：依赖 props 或 state**

如果你暴露的方法依赖于组件的状态或属性，则需要传入依赖项，否则父组件会调用到旧的闭包。

```tsx
useImperativeHandle(ref, () => ({
  getValue: () => value,
}), [value]);
```

🔎 当 value 改变时，getValue 方法会重新生成，从而读取到最新值。

##### **🚫 四、常见误区**

| **错误**                   | **问题描述**                                        |
| -------------------------- | --------------------------------------------------- |
| ❌ 不传依赖但方法依赖 state | 暴露的方法中捕获的是旧值（stale closure）。         |
| ❌ 忘记用 forwardRef        | 会报错 “Function components cannot be given refs”。 |
| ❌ 每次渲染都生成新对象     | 父组件可能感知到 ref 改变，引起不必要的更新。       |

##### **✅ 五、最佳实践总结**

| **场景**                       | **依赖写法**           | **说明**                                |
| ------------------------------ | ---------------------- | --------------------------------------- |
| 暴露的方法只操作 DOM（无依赖） | []                     | 最常见、安全高效。                      |
| 暴露的方法依赖 props/state     | [依赖项]               | 确保捕获最新值。                        |
| 需要暴露稳定函数（不随渲染变） | [] + 内部 ref 存最新值 | 例如 useRef 保存 state 最新值避免依赖。 |

##### **🔧 forwardRef + useImperativeHandle 工作流程图**

```
父组件 App
│
│   const childRef = useRef();
│   └─────────────┬─────────────────────────────┐
│                 │                             │
│             ▼ 调用                           ▼ 调用
│     <Child ref={childRef} />           childRef.current?.someMethod()
│
└───────────────────────────────────────────────┘
                      |
                      ▼
────────────────────────────────────────────────────
           子组件 Child (通过 forwardRef 包裹)
────────────────────────────────────────────────────
  function Child(props, ref) {       // ref 来自父组件
      const innerRef = useRef();     // 指向真实 DOM 或实例

      useImperativeHandle(ref, () => ({
          // 暴露给父组件的“命令式 API”
          focus: () => innerRef.current?.focus(),
          clear: () => innerRef.current.value = '',
      }), []); // 空依赖 -> 只创建一次
      │
      │
      ▼
      ref.current = {
          focus: () => ...,
          clear: () => ...
      }
      // ↑ useImperativeHandle 把返回的对象
      //   赋值给了父组件的 childRef.current

      return <input ref={innerRef} />;
  }

────────────────────────────────────────────────────

父组件现在能这样调用 ↓

  childRef.current.focus()
  childRef.current.clear()

────────────────────────────────────────────────────
```

#### **4、依赖项与“陈旧闭包”（stale closure）**

useImperativeHandle(ref, createHandle, deps) 与 useMemo/useCallback 类似，会在 **依赖变化** 时重新生成暴露对象。如果你的 handle 方法**依赖 props 或 state**，要么：

- 在 deps 中声明依赖；
- 或者**倾向暴露函数而非值**（函数从当前闭包读取最新数据），并把依赖写进 deps，确保函数捕获的是最新状态。

示例：暴露“读取最新选中项”的函数（而不是把数组本身暴露出去）：

```tsx
useImperativeHandle(ref, () => ({
  getSelected: () => selectedIds,  // 始终读最新
}), [selectedIds]);
```

如果你暴露的是**值**而不是函数，却又忘了加依赖，父组件拿到的可能是“过期值”。

##### **🔥 示例：useImperativeHandle 中的陈旧闭包**

```tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type CounterHandle = {
  logCount: () => void;
};

const Counter = forwardRef<CounterHandle>((_, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    // 这个函数捕获了“当时”的 count
    logCount: () => {
      console.log('count =', count);
    },
  }),[]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
});

export default function App() {
  const counterRef = useRef<CounterHandle>(null);

  return (
    <div>
      <Counter ref={counterRef} />
      <button onClick={() => counterRef.current?.logCount()}>
        打印 count
      </button>
    </div>
  );
}
```



#### 5、**最小可用示例**

定义“可暴露的方法类型”，确保父/子两端都类型安全：

```tsx
import {forwardRef, useImperativeHandle, useRef} from "react";

export type TextInputHandle = {
    focus:()=> void;
    clear:()=> void;
    getValue:()=> string;
}
type Props = {
    initial?: string;
}
const TextInput = forwardRef<TextInputHandle,Props>(({ initial='' },ref)=>{

    const inputRef = useRef<HTMLInputElement>(null);

    const clear = () =>{
        if (inputRef.current){
            inputRef.current.value = '';
        }
    }
    const getValue = () => inputRef.current?.value ?? ''
    useImperativeHandle(
        ref,
        ()=>({
            focus:() => inputRef.current?.focus(),
            clear,
            getValue
        }),
        []
    )
    return (
        <>
            <input ref={inputRef} defaultValue={initial} />
        </>
    )
})

export default TextInput;
```

**父组件：**

```tsx
// App.tsx
import React, { useRef } from 'react';
import TextInput, { TextInputHandle } from './TextInput';

export default function App() {
  const inputRef = useRef<TextInputHandle>(null);

  return (
    <div>
      <TextInput ref={inputRef} initial="Hello" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
      <button onClick={() => alert(inputRef.current?.getValue())}>Get</button>
    </div>
  );
}
```

## **Part15、useContext 用法**
useContext 解决 **跨层级传参（避免 prop drilling）** 的问题。它让你在函数组件中读取由最近的 Context.Provider 提供的值。

#### **1) 基本用法：创建 Context + Provider + 消费**

```tsx
// theme-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

// 注意：默认值用 `undefined` 并在消费处做校验，可避免“没包 Provider 也能用”的隐性 bug
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const value = { theme, setTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 推荐：封装成自定义 Hook，集中做判空校验
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
```

**消费：**

```tsx
// App.tsx
import { ThemeProvider, useTheme } from './theme-context';

function Toolbar() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span>Theme: {theme}</span>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle</button>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toolbar />
    </ThemeProvider>
  );
}
```

要点：

- createContext 的默认值建议用 undefined，**强迫**消费者必须在 Provider 内部使用（更安全）。
- 封装 useXxx() 自定义 Hook，**统一校验**与导出类型。

#### **2) 与useReducer 组合：集中管理状态与动作**

```tsx
// auth-context.tsx
import React, { createContext, useContext, useReducer } from 'react';

type User = { id: string; name: string } | null;

type State = { user: User; loading: boolean; };
type Action =
  | { type: 'login'; payload: User }
  | { type: 'logout' }
  | { type: 'loading'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading': return { ...state, loading: action.payload };
    case 'login':   return { user: action.payload, loading: false };
    case 'logout':  return { user: null, loading: false };
    default:        return state;
  }
}

type AuthContextValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: false });
  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
```

##### 消费：

```tsx
function UserPanel() {
  const { state, dispatch } = useAuth();
  if (state.loading) return <p>Loading...</p>;
  return state.user ? (
    <>
      <p>Hello, {state.user.name}</p>
      <button onClick={() => dispatch({ type: 'logout' })}>Logout</button>
    </>
  ) : (
    <button onClick={() => dispatch({ type: 'login', payload: { id: '1', name: 'Jiying' } })}>
      Login
    </button>
  );
}
```

## **Part16、useMemo用法详解**

#### **🧩 一、useMemo** **的定义与语法**

```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

##### **参数说明：**

| **参数**  | **说明**                                       |
| --------- | ---------------------------------------------- |
| () => ... | 要执行的函数，用于计算值（返回结果会被缓存）   |
| [a, b]    | 依赖项数组，当其中的值变化时才重新执行计算函数 |

#### **🧠 二、直白解释**

> ✅ React 每次组件渲染时，函数组件内部的所有代码都会重新执行。

> 如果有一些**计算量大**或者**无需每次重新算的结果**，可以用 useMemo 来“记住”上次计算的值。

例如👇

```tsx
const expensiveResult = useMemo(() => {
  console.log('计算中...');
  return heavyCalculation(data); // 假设是个很耗时的操作
}, [data]);
```

🟢 当 data 没变时，React 不会重新执行 heavyCalculation，

而是直接复用上一次的结果。

#### **⚙️ 三、应用场景**

##### **✅ 1. 优化“昂贵计算”**

例如计算一个大数组的平均值、排序、过滤等：

```tsx
function Average({ numbers }: { numbers: number[] }) {
  const avg = useMemo(() => {
    console.log('正在计算平均值...');
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }, [numbers]);

  return <div>平均值：{avg}</div>;
}
```

👉 当 numbers 没变时，不会重复计算。

##### **✅ 2. 避免子组件不必要重渲染**

如果父组件传入子组件的是一个**对象或函数**，

每次 render 都会创建新引用 → 子组件会重复渲染。

```tsx
function Parent({ userId }: { userId: number }) {
  // ⚠️ 这个对象每次 render 都是新建的！
  const userInfo = { id: userId };

  return <Child info={userInfo} />;
}
```

即使 userId 一样，{ id: userId } 也是新的对象，Child 会重新渲染。

解决方法👇：

```tsx
const userInfo = useMemo(() => ({ id: userId }), [userId]);
```

## **Part17、useCallback的用法详解**

useCallback 是 React 中非常核心的性能优化 Hook 之一，

它的作用是：

> **缓存一个函数的引用，防止每次组件重新渲染时都创建新的函数对象。**

#### **🧩 一、useCallback的定义**

```tsx
const memoizedCallback = useCallback(() => {
  // 一些逻辑
}, [依赖]);
```

##### **参数说明：**

| **参数** | **类型** | **作用**                           |
| -------- | -------- | ---------------------------------- |
| () => {} | 函数     | 你要缓存的函数逻辑                 |
| [deps]   | 数组     | 当这些依赖变化时，函数才会重新生成 |

在 React 中，**每次组件重新渲染时**，函数组件的所有内部函数都会被重新定义：

#### **🧠 二、为什么需要useCallback？**

在 React 中，**每次组件重新渲染时**，函数组件的所有内部函数都会被重新定义：

```tsx
function App() {
  const handleClick = () => console.log('click');

  return <Button onClick={handleClick} />;
}
```

> ⚠️ 每次渲染都会创建一个新的 handleClick 函数。

> 如果 Button 是一个 React.memo 子组件（通过浅比较 props 判断是否重渲染），

> 它会因为 onClick 引用变化而**重新渲染**！

##### **✅ 使用useCallback优化**

```tsx
const handleClick = useCallback(() => {
  console.log('click');
}, []); // [] 表示永远复用同一个函数引用
```

现在 handleClick 的引用在多次渲染中保持稳定，

React.memo(Button) 不会因为 onClick 的变化而重新渲染。
