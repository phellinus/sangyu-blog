---
description: let、var和const的区别
sticky: 9
tags:
  - 面试题
tag:
  - javascript
---

# 📘 let、var和const的区别

> ✍️ 作者：桑榆  
> 🕓 更新时间：2026-01-01  
> 🧠 关键词：let, var, const,作用域

### 声明变量关键字汇总

在javaScript中，有三种声明变量的关键字：let、var和const。

最初声明变量的关键字就是var，但是为了解决作用域的问题，后面新增了let和const的方式

ES5中的作用域有：全局作用域、函数作用域，ES6中新增了块级作用域。块级作用域由{}包括，if语句和for语句里面的{}也属于块级作用域。

### var 关键字

- 1.没有块级作用域
    ```javascript
    //Global Scope
    {
        var a = 10;
    }
    console.log(a); // 10
    ```
- 2.有全局作用域和函数作用域
    ```javascript
    //Global Scope
    var a = 10;
    function checkscope() {
        //Function Scope
        var b = 20;
        console.log(a); // 10
        console.log(b); // 20
    }
    checkscope();
    console.log(b); // ReferenceError: b is not defined
    ```
   在全局作用域中声明的变量可以在函数作用域中访问，但是在函数作用域中声明的变量不能在全局作用域中访问。
- 3.不初始化默认值为undefined
    ```javascript
    var a;
    console.log(a); // undefined
    ```
   在全局作用域中声明了a，但是没有初始化，所以a的值是undefined。这里undefined是类型，不是字符串
- 4.存在变量提升
    ```javascript
    <script>
        console.log(a)
    </script>
    ```
    这里直接打印，控制台会报错，a is not defined

    ```javascript
    console.log(a); // undefined
    var a = 10;
    ```
    上面的代码等价于

    ```javascript
    var a;
    console.log(a); // undefined
    var a = 10;
    ```
    变量提升是因为js需要经历编译阶段和执行阶段。在编译阶段，js会将变量的声明提升到作用域的顶部。所以在上面的代码中，console.log(a)会输出undefined，而不是ReferenceError。
- 5.可以重复声明
    ```javascript
    var a = 10;
    var a = 20;
    console.log(a); // 20
    ```
    后面的声明会覆盖前面的声明。
- 6.全局作用域用var声明的变量会挂载到window对象上
    ```javascript
    var a = 10;
    console.log(window.a); // 10
    ```

### let 关键字

- 1.有块级作用域
    ```javascript
    //Global Scope
    {
        let a = 10;
    }
    console.log(a); // ReferenceError: a is not defined
    ```

- 2.不存在变量提升
    ```javascript
    console.log(a); // ReferenceError: Cannot access 'a' before initialization
    let a = 10;
    ```
    这里直接打印，控制台会报错，Cannot access 'a' before initialization。这是因为let不存在变量提升，所以在声明之前不能访问。
    
- 3.暂时死区（Temporal Dead Zone, TDZ）
    ```javascript
    //Global Scope
    {
        console.log(a); // ReferenceError: Cannot access 'a' before initialization
        let a = 10;
    }
    if (true){
        //TDZ开始
        console.log(a); // ReferenceError: Cannot access 'a' before initialization
        
        let a; // TDZ结束
        console.log(a); // undefined
  
        a = 10;
        console.log(a); // 10
    }
    ```
    使用let/const 命令声明变量之前，该变量都是不可用的
 
- 4.不能重复声明
    ```javascript
    {
        let a = 10;
        let a = 20; // SyntaxError: Identifier 'a' has already been declared
    }
    {
        let a;
        var a;
    }
    ```

### const 关键字

- 1.必须立即初始化
- 必须立即初始化
    ```javascript
    const a; // SyntaxError: Missing initializer in const declaration
    ```
  
- 常量的值不能改变
    ```javascript
    const a = 10;
    a = 20; // TypeError: Assignment to constant variable.
    ```
    const实际上保证的，并不是变量的值不能改变，而是变量指向的内存地址不能改变。
