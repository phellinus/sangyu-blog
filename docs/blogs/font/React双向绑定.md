# 📘 React 双向绑定笔记

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-10  
> 🧩 适用：React + TypeScript 项目  
> 🧠 关键词：双向绑定、状态提升、受控组件、props 回调

---

## 🧭 一、什么是“双向绑定”？

在 Vue 等框架中，双向绑定 (`v-model`) 意味着 **视图和数据的自动同步**。

在 React 中则不同：  
React 是 **单向数据流**（data flows down），也就是说：

> 状态只能从父组件流向子组件，  
> 如果子组件需要修改状态，必须**通过回调函数通知父组件修改**。

这种方式实现的数据同步效果，看起来像“双向绑定”，但其实是：

> 🧩 “**单向流动，双向表现**”

---

## 🧱 二、React 中的实现方式

React 通过 **受控组件 + 回调函数** 来模拟“双向绑定”。

---

### ✅ 1️⃣ 表单控件的双向绑定

```tsx
import { useState } from 'react';

export default function InputExample() {
    const [username, setUsername] = useState('');

    return (
        <div>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
            />
            <p>当前输入：{username}</p>
        </div>
    );
}
```

**解释：**

- `value`：绑定状态（React 控制输入框值）
- `onChange`：事件回调（更新状态）
- React 通过渲染最新的 `username` 实现视图与数据同步。

---

### ✅ 2️⃣ 父子组件状态共享（状态提升）

**父组件：**

```tsx
import { useState } from 'react';
import Child from './Child';

export default function Parent() {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <h2>父组件 count: {count}</h2>
            <Child count={count} setCount={setCount} />
        </div>
    );
}
```

**子组件：**

```tsx
interface ChildProps {
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Child({ count, setCount }: ChildProps) {
    return (
        <div>
            <p>子组件 count: {count}</p>
            <button onClick={() => setCount(count + 1)}>子组件 +1</button>
        </div>
    );
}
```

---

## ⚙️ 三、实际项目中的应用场景

| 场景                         | 示例                            | 是否适合双向绑定 |
| ---------------------------- | ------------------------------- | ---------------- |
| 表单输入框                   | 用户名、密码输入框              | ✅                |
| Switch / Checkbox            | 开关组件、勾选状态              | ✅                |
| 父子组件通信                 | 父传 `value`、子调用 `onChange` | ✅                |
| 全局状态（多个组件共享）     | 通过 Context 或 Zustand 等      | ✅                |
| 网络请求数据                 | 需要一次性渲染即可              | ❌                |
| 不可变数据（日志、只读内容） | 展示型 UI                       | ❌                |

---

## 🧩 四、React 官方推荐写法模式

### 1️⃣ 自定义受控组件

```tsx
interface InputProps {
    value: string;
    onChange: (value: string) => void;
}

const MyInput: React.FC<InputProps> = ({ value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
);
```

**父组件使用：**

```tsx
const [text, setText] = useState('');
<MyInput value={text} onChange={setText} />;
```

> ✅ **父管数据，子触发修改**  
> React 中所有组件交互都可以通过这个思路实现。

---

### 2️⃣ 利用 Context 进行跨层通信（全局双向绑定）

```tsx
// context/CollapseContext.tsx
import { createContext, useState, ReactNode } from 'react';

interface CollapseContextType {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CollapseContext = createContext<CollapseContextType | null>(null);

export const CollapseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <CollapseContext.Provider value={{ collapsed, setCollapsed }}>
            {children}
        </CollapseContext.Provider>
    );
};
```

```tsx
// 子组件
import { useContext } from 'react';
import { CollapseContext } from '@/context/CollapseContext';

const NavHeader = () => {
    const ctx = useContext(CollapseContext);
    if (!ctx) return null;
    const { collapsed, setCollapsed } = ctx;

    return <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开' : '折叠'}</button>;
};
```

---

## 💡 五、什么时候需要双向绑定？

| 使用场景               | 原因                                                    |
| ---------------------- | ------------------------------------------------------- |
| **用户输入交互**       | 需要 UI 实时反映用户输入（如表单、搜索框）              |
| **组件状态由外部控制** | 父组件希望控制子组件状态（如 Dialog、Drawer、Collapse） |
| **多组件共享状态**     | 不同组件需要同步响应同一状态变化                        |
| **逻辑解耦、状态提升** | 将业务逻辑集中管理，让子组件更纯净                      |

---

## ⚠️ 六、注意事项与最佳实践

1. **避免子组件直接修改父状态对象**
    - 推荐使用回调函数更新，而不是直接传递可变对象。
2. **保持单向数据流**
    - 父组件始终是状态的“唯一真相来源”（Single Source of Truth）。
3. **在大型项目中使用状态管理库**
    - 比如 Redux / Zustand / Jotai / Recoil 管理全局“伪双向绑定”。
4. **慎用 `useEffect` 双向监听**
    - 如果你需要 `A 改动导致 B 改动，B 改动又改回 A`，要小心无限循环。

---

## 📚 七、总结口诀

> 🧠 “父管数据，子触发修改”  
> 🔁 “状态提升，单向流动”  
> 🧩 “受控组件是关键”  
> ⚙️ “Context 实现跨层共享”  
> 🚀 “真双向少，伪双向多”

---

## ✅ 八、结尾实战示例

```tsx
// 父组件 LayoutContainer.tsx
const [collapsed, setCollapsed] = useState(false);
<NavHeader collapsed={collapsed} setCollapsed={setCollapsed} />;
```

```tsx
// 子组件 NavHeader.tsx
interface NavHeaderProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavHeader: React.FC<NavHeaderProps> = ({ collapsed, setCollapsed }) => (
    <Icon onClick={() => setCollapsed(!collapsed)} />
);
```

> ✅ 实现父子组件双向绑定，状态变化同步更新。