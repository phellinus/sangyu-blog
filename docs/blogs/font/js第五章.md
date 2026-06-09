---
description: 第五章：原型与原型链
sticky: 3
tags:
  - js
---

### 第五章：原型与原型链

1. 它是什么
先记住 5 个核心概念：  
- 对象
- prototype
- __proto__
- 原型链
- new  
它们之间的关系可以先粗暴记成一句话：  
`对象通过 __proto__ 关联到原型对象，构造函数通过 prototype 提供共享成员，属性查找沿着这条链向上，这就是原型链。`

2. 为什么这样设计
因为 JS 早期不是传统 class-based 语言，它更偏向 `prototype-based`。  
它要解决两个问题：  
  1. 多个对象怎么共享方法，避免每个对象都拷贝一份
  2. 对象之间怎么建立继承关系
比如：
```js
function Person(name) {
  this.name = name
}
```
如果把方法都写到构造函数里：
```js
function Person(name) {
  this.name = name
  this.say = function () {
    console.log(this.name)
  }
}
```
那每 new 一个实例，都会新建一个 `say` 函数，浪费内存。  
所以 JS 设计了原型：  
```js
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}
```
这样所有实例共享同一个 `say`。  
所以原型机制的核心目的就是：  
`让对象可以共享属性和方法，并通过链式关系实现继承。`  

### 3. prototype、proto、constructor 分别是什么
这是本章第一重点。

#### 3.1 prototype 是什么
`prototype` 是 `函数` 才有的一个属性。
```js
function Person() {}
console.log(Person.prototype)
```
它本质上是一个对象，这个对象会作为将来实例的原型对象。  
你可以理解为：  
`构造函数的 prototype 是给实例共享成员用的`  
例如：
```js
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}
```
这里`say`就放在原型上，所有`Person`实例都能访问。

#### 3.2 `__proto__` 是什么
`__proto__` 是 `对象` 身上的一个隐式原型引用。
```js
const obj = {}
console.log(obj.__proto__)
```
你可以把它理解成：  
`对象通过 __proto__ 指向它的原型对象`  
例如：  
```js
function Person() {}
const p = new Person()

console.log(p.__proto__ === Person.prototype) // true
```
这句非常重要，你要背下来：  
`实例对象的 __proto__ 指向构造函数的 prototype`  

#### 3.3 `constructor` 是什么
原型对象上通常会有一个`constructor`属性，指回构造函数本身。
```js
function Person() {}
console.log(Person.prototype.constructor === Person) // 
true
```
所以一般关系是：  
  - `Person.prototype.constructor === Person`
  - `p.__proto__ === Person.prototype`
### 4. 三者关系图
你可以在脑子里记成这样：  
```js
function Person() {}
const p = new Person()
```
关系是：  
  - `Person.prototype` 是原型对象
  - `p.__proto__ === Person.prototype`
  - `Person.prototype.constructor === Person`  
这三句是原型章节最基础的骨架。

### 5. 原型链是什么
**它是什么**  
原型链就是：  
`对象在查找属性时，如果自己没有，就沿着 __proto__ 一层一层往上找，直到 null 为止的链式路径`  
例如：  
```js
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}

const p = new Person('Tom')
p.say()
```
为什么 `p` 自己没有 `say` 也能调用？  
因为查找过程是：  
  1. 先看 `p` 自己身上有没有 `say`
  2. 没有就去 `p.__proto__`，也就是 `Person.prototype` 上找
  3. 在那里找到了，于是执行
这条查找路径就是原型链。

### 6. 为什么几乎所有对象最后都能找到 `Object.prototype`
因为大多数普通对象的原型链顶层都会连到：

Object.prototype
再往上是：

`Object.prototype.__proto__ === null`
也就是说，原型链的终点通常是 `null`。

所以：

```js
const obj = {}
obj.__proto__ === Object.prototype // true
Object.prototype.__proto__ === null // true
```

这就是为什么很多对象都能用： 
`toString`
`hasOwnProperty`
因为这些方法在 `Object.prototype` 上。

### 7. new 到底做了什么
这是本章第二重点，也是面试超高频。  
```js
function Person(name) {
  this.name = name
}

const p = new Person('Tom')
new Person('Tom') 
```
大致做了 4 件事：

1. 创建一个新对象
2. 让这个新对象的 __proto__ 指向 Person.prototype
3. 用这个新对象作为 this 执行构造函数
4. 如果构造函数没有显式返回对象，就返回这个新对象
你可以粗略理解成伪代码：
```js
function myNew(fn, ...args) {
  const obj = {}
  obj.__proto__ = fn.prototype
  const result = fn.apply(obj, args)
  return typeof result === 'object' && result !== null ? result : obj
}
```
这就是为什么：
```js
p.__proto__ === Person.prototype
```
成立。

### 8. instanceof 的底层原理
这也是超高频。

`p instanceof Person`
本质判断的是：
```
Person.prototype 是否出现在 p 的原型链上
```
也就是沿着：
```
p.__proto__
p.__proto__.__proto__
...
```
一路往上找，看有没有等于 Person.prototype。

如果找到，就是 true；找不到直到 null，就是 false。

例如：
```js
[] instanceof Array   // true
[] instanceof Object  // true
```
为什么都是真？

因为数组的原型链上既有 Array.prototype，也最终会连到 Object.prototype。

### 9. 属性查找规则
当你访问：
```js
p.name
p.say()
```
查找顺序是：

- 先找对象自身属性
- 没有就找原型对象
- 再没有继续沿原型链向上
- 直到 null
- 还没有就是 undefined

这叫：`就近原则`

如果对象自身和原型上都有同名属性，优先用对象自己的。

例如：
```js
function Person() {}
Person.prototype.name = 'proto'

const p = new Person()
p.name = 'self'

console.log(p.name) // self
```
### 10. 为什么函数也是对象
因为在 JS 里，函数本身也是一种特殊对象。

所以函数既可以：

像对象一样有属性
又可以被调用执行
例如：
```js
function fn() {}
fn.a = 1
console.log(fn.a) // 1
```
同时函数还有 prototype，这是它作为构造函数时提供给实例用的。

所以你要记住：

函数是可调用对象。

### 11. Object.create() 是什么
这个也常考。
```js
const obj = Object.create(proto)
```
它会创建一个新对象，并让这个对象的原型指向 proto。

你可以理解为：
```js
Object.create(proto) 
等价于“创建一个空对象，并把它的 proto 指向 proto”
```
这在手写继承、创建原型关联对象时很常用。

### 12. hasOwnProperty 和 in 的区别
`hasOwnProperty`
只看对象自身有没有这个属性

`in`
会连原型链一起查

例如：
```js
function Person() {}
Person.prototype.say = function () {}

const p = new Person()
p.name = 'Tom'

console.log(p.hasOwnProperty('name')) // true
console.log(p.hasOwnProperty('say')) // false

console.log('name' in p) // true
console.log('say' in p)  // true
```
这个面试很常问。

### 13. class 和原型链的关系
ES6 的 class 看起来像传统面向对象，但本质上还是原型链。
```js
class Person {
  constructor(name) {
    this.name = name
  }

  say() {
    console.log(this.name)
  }
}
```
本质上和下面很接近：
```js
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}
```
所以你面试里可以说：

class 是基于原型链的语法糖，本质并没有脱离 JavaScript 原有的原型继承模型。

### 14. 面试高频题：prototype 和 proto 的区别
标准回答    
`prototype 是函数对象上的属性，主要用于给实例提供共享属性和方法；     __proto__ 是对象上的隐式原型引用，用来指向该对象的原型对象。   
实例对象的 __proto__ 通常指向构造函数的 prototype。`

这题你一定要能顺嘴说出来。

### 15. 面试高频题：原型链是什么
标准回答    
`原型链是对象查找属性时的链式查找机制。访问一个对象属性时，会先查找对象自身，找不到就沿着它的原型对象逐级向上查找，直到 null 为止。这条由原型对象连接起来的查找路径就叫原型链。`

### 16. 面试高频题：new 做了什么
标准回答    
`new 的执行过程可以概括为四步：先创建一个新对象；再把新对象的隐式原型指向构造函数的 prototype；然后以这个新对象作为 this 执行构造函数；最后如果构造函数没有显式返回对象，就返回这个新对象。`

### 17. 面试高频题：instanceof 底层怎么判断
标准回答    
`instanceof 的本质是检查构造函数的 prototype 是否出现在某个对象的原型链上。它会沿着对象的 __proto__ 不断向上查找，直到找到目标 prototype 或查找到 null 为止。`

### 18. 这一章你必须背熟的 8 句话
- prototype 是函数上的属性，用来给实例提供共享成员。
- __proto__ 是对象上的隐式原型引用。
- 实例对象的 __proto__ 通常指向构造函数的 prototype。
- 属性查找会先找对象自身，再沿原型链向上查找。
- 原型链的终点通常是 null。
- new 会创建对象、链接原型、绑定 this、返回实例。
- instanceof 本质上是检查 prototype 是否出现在对象的原型链上。
- class 本质上是基于原型链的语法糖。
### 19. 给你几个立即判断题
题 1
```js
function Person() {}
const p = new Person()

console.log(p.__proto__ === Person.prototype)
```
答案：`true`

题 2
```js
function Person() {}
console.log(Person.prototype.constructor === Person)
```
答案：`true`

题 3
```js
const arr = []
console.log(arr instanceof Array)
console.log(arr instanceof Object)
```
答案：
`true`  `true`  
因为数组原型链最终也会到 Object.prototype。

题 4
```js
function Person() {}
Person.prototype.say = function () {
  console.log('hi')
}

const p = new Person()
console.log(p.hasOwnProperty('say'))
console.log('say' in p)
```
答案：
`false`
`true`  
### 20. 这章你先自己回答这 6 题
你按自己的话答，我再帮你逐题纠偏：

1. prototype 和 __proto__ 有什么区别？  
`prototype 是函数对象上的属性，用来给该构造函数创建出来的实例提供共享属性和方法；__proto__ 是对象身上的隐式原型引用，用来指向它的原型对象。通常实例对象的 __proto__ 会指向构造函数的 prototype。`

2. 为什么实例对象可以访问构造函数原型上的方法？ 
`因为实例对象的 __proto__ 通常会指向构造函数的 prototype，所以当访问某个属性或方法时，如果实例自身没有，就会沿着 __proto__ 指向的原型对象继续查找，因此可以访问到原型上的共享方法。`

3. 什么是原型链？   
`原型链是对象查找属性时的一种链式查找机制。访问对象属性时，会先查找对象自身；如果没有，就沿着对象的 __proto__ 指向的原型对象逐级向上查找，直到 null 为止。这条链式查找路径就叫原型链。`

4. new 到底做了什么？   
`new 的执行过程可以概括为四步：先创建一个新对象；再把新对象的 __proto__ 指向构造函数的 prototype；然后以这个新对象作为 this 执行构造函数；最后如果构造函数显式返回一个对象，就返回该对象，否则返回新创建的实例对象。`

5. instanceof 的底层判断逻辑是什么？    
`instanceof 的本质是检查构造函数的 prototype 是否出现在某个对象的原型链上。它会沿着对象的 __proto__ 不断向上查找，如果找到该 prototype 就返回 true，直到查找到 null 还没找到就返回 false。`

6. 为什么说 class 本质上还是原型链？    
`因为 ES6 的 class 只是写法上更接近传统面向对象，但本质上实例仍然是通过原型对象来共享方法，继承关系也仍然是通过原型链建立的，所以 class 并没有改变 JavaScript 基于原型的继承模型，它本质上是语法糖。`