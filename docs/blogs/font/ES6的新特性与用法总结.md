---
description: 这篇博客介绍了ES6 新特性与用法总结，关于ES6的新用法，在前端的面试中是一个常见的问题，这篇博客将总结ES6的新特性与用法，帮助读者更好地理解和应用ES6。
sticky: 9
tags:
  - 前端
tag:
  - 面试题
---

# 🧠 ES6 新特性与用法总结

> ✍️ 作者：桑榆  
> 🕓 更新时间：2025-11-06
> 🧠 关键词：let、const、解构

# ✨ ES6 新特性与用法总结

## 一、let 与 const

### 🧩 1. let

- 用于声明变量；
- 具有 **块级作用域**；
- 不存在变量提升；
- 不能重复声明。

```js
let a = 10;
if (true) {
  let a = 20;
  console.log(a); // 20
}
console.log(a); // 10
```

### 🧩 2. const

- 声明 **常量**；
- 必须赋初值；
- 不能重新赋值；
- 具有块级作用域；
- 对象的引用地址不可变，但内容可变。

```js
const obj = { name: "Tom" };
obj.age = 20; // ✅ 可修改对象内容
// obj = {}; ❌ 不允许重新赋值
```

## 二、模板字符串（Template Literals）

支持多行字符串与变量插值。

```js
const name = "Jack";
const msg = `Hello, ${name}!
Today is ${new Date().toLocaleDateString()}.`;

console.log(msg);
```

## 三、解构赋值（Destructuring）

### 📦 数组解构
```js
const [a, b, c = 3] = [1, 2];
console.log(a, b, c); // 1 2 3
```
🧱 对象解构
```js
const { name, age } = { name: "Tom", age: 18 };
console.log(name, age);
```

## 四、扩展运算符（Spread / Rest）

### 1️⃣ 展开数组或对象

```js
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log(arr2);
```
### 2️⃣ 收集剩余参数
```js
function sum(...nums) {
  return nums.reduce((a, b) => a + b);
}
console.log(sum(1, 2, 3));
```


## 五、箭头函数（Arrow Functions）

简化函数写法，自动绑定 `this`。
```js
const add = (a, b) => a + b;
const sayHi = name => console.log(`Hi, ${name}`);
```


### 六、默认参数值
```js
function greet(name = "Guest") {
  console.log(`Hello, ${name}`);
}
```

### 七、对象字面量增强写法
```js
const name = "Tom";
const age = 18;

const person = {
  name,
  age,
  sayHi() {
    console.log(`Hi, I am ${this.name}`);
  },
};
```

八、类（Class）

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
}
```

### 九、模块化（Module）
```js
// utils.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default function sayHello() { console.log("Hello"); }

// main.js
import sayHello, { PI, add } from './utils.js';
```

### 十、Promise 异步处理
```js
const fetchData = () => new Promise((resolve) => setTimeout(() => resolve("OK"), 1000));
fetchData().then(console.log);
```

### 十一、async / await

```js
async function load() {
  const data = await fetchData();
  console.log(data);
}
```

### 十二、Map 与 Set

```js
const s = new Set([1, 2, 2]);
const m = new Map([["name", "Tom"]]);
```

### 十三、Symbol（唯一值）
```js
const id = Symbol("id");
const obj = { [id]: 123 };
```

### 十四、Proxy 与 Reflect
```js
const proxy = new Proxy({}, {
  get(target, key) {
    console.log("读取属性：", key);
    return Reflect.get(target, key);
  }
});
```