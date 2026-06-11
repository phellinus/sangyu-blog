---
description: 第六章：Promise
sticky: 3
tags:
    - js
---

### 第六章：Promise

### 1. 它是什么

`Promise` 可以先记一句标准定义：

`Promise` 是 JavaScript 中用于表示异步操作最终结果的对象。

它表示的是一个“未来才会确定结果的值”。

比如发请求：

```js
const p = fetch("/api/user");
```

请求刚发出去时，结果还没回来。  
这时候你拿不到最终数据，但可以先拿到一个 Promise 对象，它代表“将来会有结果”。

所以 Promise 本质上不是“结果本身”，而是：  
对异步结果的一种统一封装

### 2. 为什么这样设计

`Promise` 出现之前，JS 主要靠回调处理异步：

```js
ajax(url, function (data) {
	console.log(data);
});
```

如果异步步骤变多，就容易写成这样：

```js
step1(function (a) {
	step2(a, function (b) {
		step3(b, function (c) {
			console.log(c);
		});
	});
});
```

这就是回调地狱。

问题有几个：

- 嵌套深，不好读
- 错误处理分散
- 控制流混乱
- 多个异步组合困难

所以 Promise 的核心设计目标就是：

- 统一异步结果的表示
- 让异步流程可以链式书写
- 让错误处理可冒泡
- 让多个异步任务更容易组合

### 3. Promise 的三种状态

Promise 有且只有三种状态：

- pending：进行中
- fulfilled：已成功
- rejected：已失败
  例如：

```js
const p = new Promise((resolve, reject) => {
	resolve(1);
});
```

这个 Promise 最终会变成 `fulfilled。`

如果：

```js
const p = new Promise((resolve, reject) => {
	reject("error");
});
```

就会变成 `rejected。`

### 4. 为什么状态一旦改变就不能再变

这是 Promise 很重要的设计。

```js
const p = new Promise((resolve, reject) => {
	resolve(1);
	reject(2);
});
```

最终只会认第一次状态变化。

原因是：

一个异步任务的最终结果应该是确定且不可逆的  
否则外部逻辑会非常混乱：

- 一会成功
- 一会失败
- 状态来回变
- 那链式调用和错误传播就没法稳定推理了。

所以 Promise 规定：

从 pending 可以变成 fulfilled
从 pending 可以变成 rejected
一旦变了，就不能再改

### 5. new Promise() 里传入的函数会立即执行吗

会。这个是高频考点。

const p = new Promise((resolve, reject) => {
console.log('run')
})

console.log('end')
输出是：

run
end
因为：

new Promise(executor) 中的 executor 是同步立即执行的`

这里你一定要分清：

Promise 构造函数里的函数是同步执行
then/catch 里的回调是异步排队执行
这是两个层次。

### 6. Promise 的底层运行逻辑

可以先粗略理解成这样：

当你写：

```js
const p = new Promise((resolve, reject) => {
	// 异步任务
});
```

Promise 内部大致做了几件事：

- 创建一个 Promise 对象，初始状态是 pending
- 立即执行传入的 executor
- executor 里可以调用 resolve 或 reject
- 一旦调用，Promise 状态改变，并记录结果
- 后续通过 then/catch 注册的回调，会在状态确定后执行

也就是说：

Promise 本身是同步创建的，它只是用来管理异步结果和回调执行时机。

注意一句很重要的话：

Promise 不是让代码变异步，而是让异步结果的管理更规范。

### 7. resolve 和 reject 是什么

`resolve`
表示这个 Promise 成功了，并把结果传出去

```js
new Promise((resolve) => {
	resolve(123);
});
```

`reject`
表示这个 Promise 失败了，并把错误传出去

```js
new Promise((resolve, reject) => {
	reject("error");
});
```

你可以理解为：

```
resolve(value)：把 Promise 变成成功
reject(reason)：把 Promise 变成失败
```

### 8. then 是什么，返回的是什么

这是本章最关键的面试点之一。

它是什么
then 用来注册成功/失败后的处理逻辑。

```js
p.then(
	(value) => console.log(value),
	(err) => console.log(err),
);
```

它返回什么
then 一定会返回一个新的 `Promise`

例如：

```js
const p2 = p1.then((value) => {
	return value + 1;
});
```

这里 p2 不是原来的 p1，而是一个新的 Promise。  
这是 Promise 能链式调用的根本原因。

### 9. 为什么 then 可以链式调用

因为每次调用 then 都会返回一个新的 Promise。

```js
p.then((res1) => {
	return res1 + 1;
})
	.then((res2) => {
		return res2 + 1;
	})
	.then((res3) => {
		console.log(res3);
	});
```

底层逻辑可以这样理解：

- 第一个 then 执行完，返回一个新 Promise
- 这个新 Promise 的结果，交给下一个 then
- 所以可以一直链下去
  所以标准结论是：

Promise 链式调用成立的根本原因，是 then 会返回一个新的 Promise。

### 10. then 回调里返回不同值，会发生什么

这块是面试高频。

**情况 1：返回普通值**

```js
Promise.resolve(1).then((res) => {
	return res + 1;
});
```

下一个 then 会收到这个普通值。

**情况 2：返回 Promise**

```js
Promise.resolve(1).then((res) => {
	return Promise.resolve(res + 1);
});
```

下一个 `then` 会等待这个 `Promise` 完成，再拿结果。

这叫：  
Promise 展开 或 状态接管  
也就是说：  
如果 then 中返回的是 Promise，后续链会等待它的结果。

**情况 3：抛出错误**

```js
Promise.resolve(1).then((res) => {
	throw new Error("fail");
});
```

返回的新 Promise 会变成 rejected，交给后面的 catch 或失败回调处理。

### 11. catch 和错误冒泡

catch 本质上就是：

then(undefined, onRejected)
它用来统一捕获链上的错误。

```js
Promise.resolve()
	.then(() => {
		throw new Error("err1");
	})
	.then(() => {
		console.log("never");
	})
	.catch((err) => {
		console.log(err);
	});
```

这里错误会一路往后传，直到被 catch 接住。  
这就是 Promise 的错误冒泡机制。
你要记住：  
Promise 链中抛出的错误或返回的 rejected Promise，会沿着链向后传播，直到被 catch 捕获。

这也是 Promise 比回调更好的地方之一，因为错误处理可以集中写。

### 12. finally 是什么

finally 表示不管成功还是失败，最后都会执行。

```js
Promise.resolve(1).finally(() => {
	console.log("end");
});
```

或者：

```js
Promise.reject("err").finally(() => {
	console.log("end");
});
```

都会执行。

常用于：

- 关闭 loading
- 清理状态
- 收尾逻辑
  注意：

finally 不接收上一步的结果作为业务处理值，它更适合做收尾，不适合改主流程数据。`

### 13. Promise 是异步的吗

这个问题很容易答混。  
更准确的说法是：  
`Promise 对象本身的创建和 executor 执行是同步的，但 then/catch/finally 注册的回调会异步执行。`

例如：

```js
console.log(1);

const p = new Promise((resolve) => {
	console.log(2);
	resolve();
});

p.then(() => {
	console.log(3);
});

console.log(4);
```

输出：

```js
1;
2;
4;
3;
```

所以不要简单说“Promise 是异步对象”，这太粗了。

正确理解是：  
`Promise 构造阶段同步`  
`回调调度阶段异步`

### 14. Promise.resolve 和 Promise.reject

```js
Promise.resolve(value)
返回一个成功状态的 Promise

Promise.resolve(123)
等价理解为：

new Promise(resolve => resolve(123))
Promise.reject(reason)
返回一个失败状态的 Promise

Promise.reject('error')
等价理解为：

new Promise((resolve, reject) => reject('error'))
这两个在封装异步接口时很常用。
```

### 15. Promise 的实际开发用途

1. 网络请求

```js
fetch("/api/user")
	.then((res) => res.json())
	.then((data) => console.log(data))
	.catch((err) => console.error(err));
```

2. 多个异步流程串联

```js
login()
	.then(() => getUserInfo())
	.then(() => getPermission())
	.catch((err) => console.error(err));
```

3. 统一错误处理  
   错误集中到一个 catch 里。

4. 封装旧回调 API  
   把回调风格改造成 Promise 风格。

5. 面试高频题：Promise 到底是什么  
   标准回答  
   `Promise 是 JavaScript 中用于表示异步操作最终结果的对象。它把异步任务的成功或失败结果以及对应的处理逻辑封装起来，使异步流程可以链式书写，并支持统一的错误处理。`

6. 面试高频题：Promise 的状态有哪些  
   标准回答  
   `Promise 有三种状态：pending、fulfilled 和 rejected。初始状态是 pending，可以变为 fulfilled 或 rejected，并且状态一旦改变就不可逆。这样设计是为了保证异步结果的确定性。`

7. 面试高频题：then 返回的是什么  
   标准回答  
   `then 一定会返回一个新的 Promise。这个新 Promise 的状态和值，取决于 then 回调的执行结果：如果返回普通值，则新 Promise 会成功并携带该值；如果返回 Promise，则新 Promise 会等待它的结果；如果抛出错误，则新 Promise 会变为 rejected。`

这题你一定要会。

### 19. 面试高频题：new Promise() 里的函数会立即执行吗

标准回答  
`会立即执行。new Promise 传入的 executor 会在 Promise 创建时同步执行。需要注意的是，Promise 构造函数是同步执行的，但 then/catch/finally 注册的回调会异步调度执行。`

### 20. 这一章你必须背熟的 8 句话

- Promise 是对异步操作最终结果的对象化封装。
- Promise 有三种状态：pending、fulfilled、rejected。
- Promise 状态一旦改变就不可逆。
- new Promise() 里的 executor 会同步立即执行。
- then 一定返回一个新的 Promise。
- Promise 能链式调用的根本原因是 then 返回新 Promise。
- Promise 链中的错误会沿着链向后冒泡，直到被 catch 捕获。
- Promise 创建阶段同步，then/catch 回调执行阶段异步。

### 21. 给你几个判断题

题 1

```js
const p = new Promise((resolve) => {
	console.log(1);
	resolve();
});
console.log(2);
```

输出：

```js
1;
2;
```

因为 executor 同步执行。

题 2

```js
Promise.resolve(1)
	.then((res) => {
		return res + 1;
	})
	.then((res) => {
		console.log(res);
	});
```

输出：

```js
2;
```

因为 then 返回的新 Promise 会把返回值传给下一个 then。

题 3

```js
Promise.resolve()
	.then(() => {
		throw new Error("fail");
	})
	.catch((err) => {
		console.log("caught");
	});
```

输出：

```js
caught;
```

因为错误会冒泡到 catch。

### 22. 这一章你先自己回答这 6 题

你按自己的话答，我再像前几章一样逐题纠偏：

1. Promise 到底是什么？它为了解决什么问题？  
   `Promise 是 JavaScript 中对异步操作最终结果的对象化封装，它统一表示异步任务的进行中、成功和失败状态，并把后续处理逻辑组织成链式调用。它主要用来解决回调地狱、错误处理分散以及多个异步任务难以组合的问题。`

2. Promise 有哪三种状态？为什么状态不能反复变化？  
   `Promise 有三种状态：pending、fulfilled 和 rejected。状态一旦从 pending 变为 fulfilled 或 rejected，就不能再改变。这样设计是为了保证异步结果的确定性，使链式调用和错误冒泡都有稳定、可预测的行为。`

3. new Promise() 里传入的函数会立即执行吗？  
   `会立即同步执行，但 then/catch 注册的回调不是立刻同步执行，而是后续异步调度执行`

4. then 返回的是什么？为什么 Promise 可以链式调用？  
   `then 一定返回一个新的 Promise。这个新 Promise 的状态和值由 then 回调的执行结果决定。因为每次 then 都返回新的 Promise，所以上一个 then 的结果可以继续交给下一个 then，这就是 Promise 可以链式调用的根本原因。`

5. 如果 then 里返回普通值、返回 Promise、抛出错误，分别会怎样？  
    `返回普通值：新 Promise 会变成 fulfilled，下一个 then 会收到这个值
返回 Promise：新 Promise 会等待这个 Promise 的结果，再决定后续状态
抛出错误：新 Promise 会变成 rejected，错误会交给后面的 catch 或失败回调处理`  
    你现在的理解已经是对的，只是要把“最后会被 catch 捕获”改成更严谨的说法：  
    `会使 then 返回的新 Promise 变为 rejected，之后如果链上有 catch，就会被捕获。`

6. Promise 的错误为什么可以被后面的 catch 统一捕获？  
   `因为 Promise 链中的异常和 rejected 状态都会沿着链向后传播，而 catch 本质上就是对 rejected 状态的统一处理入口，所以可以集中捕获前面链路中的错误。catch 本质上可以理解为 then(undefined, onRejected)`
