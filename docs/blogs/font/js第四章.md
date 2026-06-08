---
description: 第四章：this 指向
sticky: 3
tags:
  - js
---


### 第四章：this 指向

### 1. 它是什么
this 本质上是：  
`函数在执行时绑定的一个运行时对象引用`
你可以先把它理解成：  
`this` 不是在函数声明时固定好的，而是大多数情况下在函数调用时决定的  
比如：  
```js
function fn() {
  console.log(this)
}
```
单看这个函数定义，你不知道 this 是谁。  
必须看它“怎么被调用”。  
### 2. 为什么这样设计  
因为 JS 里的函数很灵活：  
- 可以单独调用
- 可以作为对象方法调用
- 可以被 `call/apply/bind` 改变调用者
- 可以被 new 调用
- 可以作为回调传来传去

如果函数内部不能知道“这次是谁在调用我”，很多场景就不好写。  
例如对象方法：  
```js
const user = {
  name: 'Tom',
  say() {
    console.log(this.name)
  }
}
```
这里如果没有 `this`，`say` 很难自然地访问“当前对象”的数据。  
所以 `this` 的设计目标就是：  
`让同一个函数在不同调用场景下，可以拿到当前这次调用关联的上下文对象`
### 3. 底层怎么运行
你先记住一句总原则：  
`普通函数的 this，看调用方式；箭头函数的 this，看定义位置。`
这是整章最核心的一句。  
### 4. 普通函数 this 的 4 种绑定规则
面试里最常讲这 4 类：  
1. 默认绑定
2. 隐式绑定
3. 显式绑定
4. `new` 绑定
#### 4.1 默认绑定
普通函数直接调用时，走默认绑定。
```js
function fn() {
  console.log(this)
}

fn()
```
浏览器非严格模式  
通常是 `window`  
严格模式
是 `undefined`  
所以你面试里最好别死背“默认就是 window”，更严谨说法是：  
`普通函数直接调用时，this 走默认绑定。在浏览器非严格模式下通常指向 window，在严格模式下是 undefined。`  
这个很重要。  
#### 4.2 隐式绑定
当函数作为某个对象的方法被调用时，`this` 指向调用它的那个对象。
```js
const user = {
  name: 'Tom',
  say() {
    console.log(this.name)
  }
}

user.say() // Tom
```
这里 `this === user`  
注意关键词不是“函数定义在哪”，而是：  
`点前面是谁，调用时 this 通常就是谁`  

#### 4.3 隐式绑定丢失
这是面试很爱考的坑。
```js
const user = {
  name: 'Tom',
  say() {
    console.log(this.name)
  }
}

const fn = user.say
fn()
```
这里输出不是 `Tom`。  
为什么？  
因为：  
- `user.say()` 这样调用时，才是隐式绑定
- `const fn = user.say` 只是把函数拿出来
- `fn()` 是普通函数直接调用，变成默认绑定了  
所以你要记住：  
`this 不是看函数原来属于谁，而是看这次怎么调用`  
#### 4.4 显式绑定
可以用 `call`、`apply`、`bind` 人为指定 `this`。
```js
function fn() {
  console.log(this.name)
}

const obj = { name: 'Tom' }

fn.call(obj)   // Tom
fn.apply(obj)  // Tom
```
call  
立即调用，参数一个个传  
```js
fn.call(obj, a, b)
```
apply  
立即调用，参数以数组传  
```js
fn.apply(obj, [a, b])
```
bind  
不立即调用，返回一个新函数，并永久绑定 `this`  
```js
const newFn = fn.bind(obj)
newFn()
```
面试标准区分：  
`call 和 apply 都是立即执行，区别在于传参方式不同；bind 不会立即执行，而是返回一个绑定了 this 的新函数。`
#### 4.5 new 绑定
当函数通过 `new` 调用时，`this` 指向新创建的实例对象。
```js
function Person(name) {
  this.name = name
}

const p = new Person('Tom')
console.log(p.name) // Tom
```
这里 `this === p`  
你可以先记住`new`做了几件事：  
  1. 创建一个新对象
  2. 让新对象的原型指向构造函数的 prototype
  3. 把构造函数里的 this 绑定到这个新对象
  4. 执行函数体
  5. 默认返回这个新对象
后面讲原型链时我们会再展开。

### 5. 箭头函数为什么特殊
箭头函数没有自己的 `this`。  
这是整章另一个核心结论。  
```js
const fn = () => {
  console.log(this)
}
```
箭头函数的 `this` 不是调用时决定的，而是：  
`在定义时，继承外层普通作用域中的 this`  
也就是说：
- 普通函数：`this` 看调用方式
- 箭头函数：`this` 看定义位置的外层 `this`
例如：
```js
const obj = {
  name: 'Tom',
  say: () => {
    console.log(this.name)
  }
}

obj.say()
```
这里很多人以为输出 `Tom`，其实通常不是。  
因为箭头函数 `say` 没有自己的 `this`，它不会因为 `obj.say()` 就把 `this` 绑定成 `obj`。它只会继承定义时外层的 `this`。  
所以：  
`箭头函数不适合拿来定义对象方法，除非你非常明确地就是要继承外层 this`。  
### 6. 为什么箭头函数这样设计
因为普通函数在回调场景里，`this` 很容易丢。  
比如以前常见写法：  
```js
function Timer() {
  this.count = 0

  setInterval(function () {
    this.count++
  }, 1000)
}
```
这里回调函数里的 this 通常不是外面的实例对象。  
以前常用：  
```js
const self = this
```
或者：  
```js
setInterval(function () {
  console.log(this)
}.bind(this), 1000)
```
箭头函数就是为了解决这种问题：  
```js
function Timer() {
  this.count = 0

  setInterval(() => {
    this.count++
  }, 1000)
}
```
因为箭头函数直接继承外层 `this`。  
所以箭头函数的设计目的之一就是：  
`避免回调中 this 丢失`

### 7. this 和作用域的区别
这个点你必须分清。
很多人把 `this` 和作用域混在一起，这是错的。
**作用域**
决定变量从哪里找
**this**
决定函数执行时的上下文对象是谁
例如：
```js
const name = 'global'

const obj = {
  name: 'Tom',
  say() {
    const name = 'inner'
    console.log(name)
    console.log(this.name)
  }
}

obj.say()
```
输出：
```js
inner
Tom
```
解释：
- `name` 是普通变量，按作用域规则找
- `this.name` 是对象属性，按 `this` 指向找
所以你要记住：  
`作用域链解决“变量从哪找”，this 解决“当前调用者是谁”`  
### 8. this 绑定优先级
如果多个规则同时出现，优先级要分清。  
常见优先级可以这么记：  
`new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定`
例如：  
**显式绑定比隐式绑定强**
```js
function fn() {
  console.log(this.name)
}

const obj1 = { name: 'A', fn }
const obj2 = { name: 'B' }

obj1.fn.call(obj2) // B
```
虽然本来 `obj1.fn()` 会指向 `obj1`，但 `call(obj2)` 强行改成了 `obj2`。  
**new 绑定比 bind 更高**  
这个属于进阶点，先知道即可：  
```js
function Person(name) {
  this.name = name
}

const obj = {}
const Fn = Person.bind(obj)
const p = new Fn('Tom')

console.log(p.name) // Tom
```
这里 `new` 会优先生成新实例。  

### 9. 面试高频坑题
**题 1**
```js
var name = 'global'

const obj = {
  name: 'Tom',
  say() {
    console.log(this.name)
  }
}

const fn = obj.say
fn()
```
结果：  
- 浏览器非严格模式下通常是 `global` 或全局对象上的值
- 严格模式下可能报错或是 `undefined`
核心原因：  
`隐式绑定丢失，退回默认绑定`  
**题 2**
```js
const obj = {
  name: 'Tom',
  say: () => {
    console.log(this.name)
  }
}

obj.say()
```
结果通常不是 `Tom`  
原因：  
`箭头函数没有自己的 this，它继承定义时外层 this，而不是调用时的 obj`
### 题 3
```js
function fn() {
  console.log(this.name)
}

const obj = { name: 'Tom' }
const newFn = fn.bind(obj)
newFn()
```
结果：`Tom`
原因：
`bind` 返回了一个永久绑定 obj 的新函数`

### 10. call、apply、bind 的本质区别
**它是什么**
都是改变函数执行时 `this` 的方法。  
区别  
  - `call`：立即执行，参数逐个传
  - `apply`：立即执行，参数数组传
  - `bind`：不立即执行，返回新函数
**面试标准回答**
`它们的共同点是都可以显式指定函数执行时的 this。不同点在于 call 和 apply 会立即执行，区别只是传参形式不同；bind 不会立即执行，而是返回一个新的绑定函数。`

### 11. 实际开发里怎么用
1. 对象方法里访问当前对象
```js
const user = {
  name: 'Tom',
  say() {
    console.log(this.name)
  }
}
```
2. 回调里避免 this 丢失
优先用箭头函数：  
```js
class Demo {
  constructor() {
    this.count = 0
  }

  start() {
    setInterval(() => {
      this.count++
    }, 1000)
  }
}
```
3. 手动绑定事件处理函数
```js
this.handleClick = this.handleClick.bind(this)
```
这个在类组件、老代码里很常见。  
### 12. 面试高频题：this 到底是什么
标准回答  
`this 不是函数定义时固定的，而是函数执行时绑定的一个上下文对象引用。对于普通函数来说，this 的指向主要取决于调用方式；对于箭头函数来说，它没有自己的 this，而是继承定义时外层作用域的 this。`

### 13. 面试高频题：箭头函数和普通函数的 this 有什么区别
标准回答  
`普通函数的 this 在调用时确定，取决于调用方式；箭头函数没有自己的 this，它会在定义时从外层作用域继承 this，因此不能通过 call、apply、bind 或作为对象方法调用来改变它的 this 指向。`

### 14. 这一章你必须背熟的 8 句话
- this 是函数执行时绑定的上下文对象引用。
- 普通函数的 this 主要看调用方式，不看定义位置。
- 对象方法调用时，this 通常指向调用它的对象。
- 函数一旦脱离对象单独调用，通常会发生 this 丢失。
- call、apply、bind 都可以显式指定 this。
- bind 不会立即执行，而是返回一个新函数。
- new 调用时，this 指向新创建的实例对象。
- 箭头函数没有自己的 this，它继承定义时外层的 this。
### 15. 你先自己回答这 6 题
你按自己的话答，我再像前几章一样逐题纠偏：  
1. this 到底是什么？  
`this 是函数执行时绑定的上下文对象引用。普通函数的 this 主要取决于调用方式，箭头函数没有自己的 this，而是继承定义时外层环境的 this。`

2. 普通函数的 this 是在定义时确定，还是调用时确定？

`普通函数的 this 是在调用时确定的,它主要由调用方式决定，而不是由函数定义的位置决定。`

3. call、apply、bind 有什么区别？

`call、apply、bind 都可以显式改变函数执行时的 this。call 和 apply 会立即执行，区别在于 call 逐个传参，apply 以数组形式传参；bind 不会立即执行，而是返回一个绑定了 this 的新函数。`

4. 为什么 const fn = obj.say; fn() 往往会丢失 this？

`因为 this 不看函数原来属于哪个对象，而看当前的调用方式。obj.say 在赋值给 fn 后，再通过 fn() 调用时，已经不再是对象方法调用，而是普通函数调用，所以原本的隐式绑定丢失，this 会退回默认绑定。`

5. 箭头函数的 this 和普通函数有什么本质区别？

`普通函数有自己的 this，this 在调用时根据调用方式确定；箭头函数没有自己的 this，它会在定义时继承外层执行上下文中的 this，之后不能再通过 call、apply、bind 或 new 去改变。`

6. 为什么说 this 和作用域链不是一回事？

`作用域链解决的是变量查找问题，也就是当前作用域找不到变量时，沿着外层词法环境逐级查找；this 解决的是函数执行时上下文对象是谁的问题，它不参与普通变量的词法查找规则。`