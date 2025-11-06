---
description: 介绍 Vue3 中 TypeScript 数据类型的基础，包括数字、字符串、布尔、数组、元组、枚举、any 和 void 等类型的使用和区别。
sticky: 10
---

# Vue3+ts+vite笔记

## TypeScript数据类型基础

```typescript
//数字类型
let num:number = 123;
num=1233;
//字符串类型
let str:string = "123";
str="1"
//布尔类型
let bool:boolean = true;
//bool=1;
```

`symbol` 类型表示唯一的、不可变的值，通常用作对象属性的键。`symbol` 值是唯一的，即使它们具有相同的描述。

可以使用 `Symbol` 构造函数来创建一个 `symbol` 值。

```typescript
//symbol类型
let sym:symbol = Symbol();
```

`never` 类型表示那些永远不会发生的值。它通常用于以下场景：

当一个函数永远不会正常返回时，可以使用 `never` 类型。例如，函数抛出异常或进入无限循环。

```typescript
//never类型
function a():never{
    throw new Error('error')
}
//never类型
function b():never{
    while(true){
        
    }
}
```

## 数组和元组

```typescript
//数组
let arr =[1,2,3,4,5];

let arr1:number[] = [1,2,3,4,5];

let arr2:Array<number>=[1,2,3,4,5];

//元组 => 定长的数组
let arr3:[number,string] =[1,"test元组"];

//元组和数组的区别
//元组：更适用于定义静态、明确定义的数量的情况下去使用
//数组：更适用于包含任意数量的相同元素的情况

//元组的适用场景
function test(a:string,b:number){

}

function test1(...args:[string,number]){

}
test("1",23); //a="1",b=23
test1("1",1);//["1",1]
```

## 枚举类型

```typescript
//枚举类型

//常量的集合
//超级管理员
//管理员
//用户
enum UserAuth{
    SUPER_ADMIN=1,
    ADMIN,
    USER
}
let role:UserAuth = UserAuth.USER;
role=1
```

## any和void的用法

- **`any`**：表示任意类型，灵活性高，但会失去类型安全性，应谨慎使用。
- **`void`**：表示没有返回值，通常用于函数返回值，明确表示函数不返回任何值。

```typescript
//any 和 void
//any
let nume :any = 1;

nume = "2"

nume=true

nume=Symbol()

//void
function test():void{
    console.log("sss");
    return undefined;
}

function test1(){
    
}
```

## null和undefined详细介绍

`null` 表示变量被显式赋值为“空”或“无值”。它通常用于表示一个变量有意地没有值。

```typescript
let y: string | null = "Hello";
y = null; // 显式清空变量

let person: { name: string | null } = { name: null }; // 初始化对象属性为 null
person.name = "Alice"; // 后续赋值
```

`undefined` 表示变量已声明但尚未赋值，或者函数没有返回值时的默认返回值。

```typescript
let x: number;
console.log(x); // 输出: undefined，因为 x 未赋值

function greet(name?: string): void {
    console.log(`Hello, ${name || 'Guest'}`);
}
greet(); // 输出: Hello, Guest，因为 name 是 undefined

function noReturn(): void {
    // 没有 return 语句
}
console.log(noReturn()); // 输出: undefined
```

## 接口定义

```typescript
//接口

//约束定义类型 对象、属性、方法

interface Fly {
    fly():void
}

class Bird implements Fly {
    // fly(){

    // }
    fly(): void {
        
    }
}
```

## 可选属性和索引签名

```typescript
interface Config {
    url: string;
    method?: string; // method 是可选的
    timeout?: number; // timeout 是可选的
}

const config1: Config = {
    url: "https://example.com",
    method: "GET"
};

const config2: Config = {
    url: "https://example.com"
    // method 和 timeout 都未提供
};

console.log(config1.method); // 输出: GET
console.log(config2.method); // 输出: undefined
```



```typescript
//可选属性和索引签名
interface UserInfo{
    username:string,
    password:string,
    //可选属性的定义
    gender?:number
    //索引签名
    [key:string]:any
}

const userInfo:UserInfo={
    username:"11",
    password:"12",
    gender:0,
}

userInfo.email="12"
```

## 只读属性

```typescript
//可选属性和索引签名
interface UserInfo{
    username:string,
    readonly password:string,//属性前加上readonly就是只读属性
    //可选属性的定义
    gender?:number
    //索引签名
    [key:string]:any
}

```

## 接口的继承

```typescript
//接口继承
interface Anmial{
    name:string
}
interface AnimalCommon{
    pawLength:number
}
interface Cat extends Anmial,AnimalCommon{
    type:string
}
```

## 接口的合并现象

```typescript
//接口的合并现象
interface Animal{
    name:string
}
interface Animal{
    gender:number
}
class A implements Animal{
    name: string
    gender: number
}
```

## 函数

```typescript
//函数
function setUserInfo(name:string = "123"):string{
    return name;
}

setUserInfo()

//箭头函数
const setUserInfo1=(name:string="1"):string =>{
    return name;
}
setUserInfo1("2342")

//接口函数
interface UserInfo{
    username:string,
    setuserInfo:(name:string) => void;
    setUserName(name:string):void
}
```

## 类型推断和类型断言

```typescript
//类型推断
let a1 = 12;
//a1="12";

function test1(){
    return 1;
}
//类型断言
let a2:any = 12;
//企业级的一种写法
(a2 as string).length;

(<string>a2).length;
```

## 类的详解

```typescript
class Animaltest{
    constructor(public name){

    }
    eat(){
        return this.name;
    }
}
//属性修饰符
//public、private、protected
//ts属性修饰符 readonly 只读属性
//方法修饰符：public、private、protected
class Animaltest2{
    public gender?:number
    constructor(public name:string,gender:number){
        this.gender = gender
    }
    eat(){
        return this.name
    }
}

interface AnimalInteger{
    name:string,
    gender?:number
}
interface AnimalInter1{
    powLength:number
}
class Animal22 implements AnimalInteger,AnimalInter1{
    public powLength: number;
    constructor(public name,public gender){

    }
}
```

## 类的设置器与获取器

```typescript
//属性的拦截器
class People{
    private _gender:number;
    constructor(gender){
        this._gender = gender;
    }
    //0和1 =>男和女
    get gender(){
        return this._gender === 0?'男':'女'
    }
    set gender(gender:string){
        this._gender = gender==="男"?0:1;
    }
}

const people = new People(0);
console.log(people.gender);
people.gender="女";
console.log(people.gender);
```

## 面向对象的基本原则

```typescript
class AnimalA{
    constructor(public name:string){}
    public getName(){
        return this.name;
    }
}
class AnimalB extends AnimalA{
    constructor(name:string,public gender:number){
        super(name);
    }
}
abstract class Animalc{
    constructor(public name:string){}
    public abstract getName():string
}

class Catc extends Animalc{
    constructor(name:string){
        super(name);
    }
    public getName(): string {
        return this.name;
    }
}

class Dog extends Animalc{
    constructor(name:string){
        super(name)
    }
    public getName(): string {
        return this.name;
    }
}

const dog:Animalc = new Dog("dog")

const cat:Animalc = new Catc("cat")
```

## 类装饰器

```typescript
//类装饰器

function GetId(target:Function,key:any){
    console.log(key,target);
    target.prototype.id = Math.random();
}
function LogoInfo(target:Function,key:any){
    console.log("LogInfo");
}
@GetId
class User{
    public id:number;
    @LogoInfo
    getUserInfo(){}
}

const user = new User();
console.log(user.id);
user.getUserInfo()
```

## 泛型应用

```typescript
//泛型
// TS中的一种特性，定义函数、接口或者类的时候

function getParam(arg:number):number{
    return arg;
}

getParam(1)

function getParam1(arg:any):any{
    return arg;
}

getParam1(1)

function getParam2<T>(arg:T):T{
    return arg;
}

getParam2(2)
let a= getParam2('2')

const getParam3 = <T>(arg:T):T=>{
    return arg;
} 

interface AB<T>{
    name:T
}

let obj1:AB<string>= {
    name:"123"
}

class B<T>{
    name:T
}

const b = new B<string>()
b.name.length
```

## 泛型约束和泛型默认值

```typescript
//泛型约束
interface Haslength{
    length:number
}

function getLength<T extends Haslength>(arg:T){
    return arg.length
}

getLength("12")
getLength([1,3])
//泛型默认值
function getLength1<T extends Haslength = string>(arg:T){
    return arg.length
}

getLength1("123")
getLength1([])
```

## 交叉引用、联合类型、类型保护

```typescript
//交叉引用
interface AA{
    aa:string
}

interface BB{
    bb:string
}

interface CC extends AA,BB{
    cc:string
}

type DD = AA & BB & { cc:string }

let dd:DD = {
    aa: "aa",
    bb: "bb",
    cc: "cc"
}

let ee:CC={
    aa: "aa",
    bb: "bb",
    cc: "cc"
}

//联合类型
type BBB = string | number

let bbb:BBB = "1231";
bbb = 123;

let aaaa:(string|number)[] =[1,2,3,'4']

//类型保护
function getVal():string|number{
    return Math.random()>0.5?'1':0;
}

const val = getVal()

const isStr = (val:unknown):val is string =>{
    return typeof val === 'string'
}
//如果val是string类型，我们获取长度
if(isStr(val)){
    console.log("当前是string并且长度是:",val.length);
}else{
    console.log("这是number类型:",val);
    
}


```

## 可辨识联合类型

```typescript
//可辨识 联合类型

//可以被分辨的类型 字面量
const aaaaa = 1;

type AAAA = 1;
let bbbb:AAAA = 1;
// 需求：我们需要求圆的面积和正方形的面积
interface Circle{
    radius: number,
    kind: 'circle'
}

interface Square{
    width: number,
    kind: 'square'
}

type Shape = Circle | Square;

function getArea(shape:Shape):number{
    if(shape.kind==="square"){
        return shape.width*shape.width
    }else{
        return Math.PI * shape.radius ** 2
    }
}

const circle:Circle = {
    radius: 10,
    kind:"circle"
  }
  
  const square:Square = {
    width:10,
    kind:"square"
  }
  
  console.log(getArea(circle));
  console.log(getArea(square));
```

## 索引访问与查询

```typescript
//索引访问与查询
interface BBBC{
    aa:string,
    bb:number
}

type BBBCA = BBBC['aa']

//keyof

type BBBKEY = keyof BBBC

let key11:BBBKEY = 'aa'

//应用场景
const aaaObj = {
    aa:"1",
    bb:1
}

function getObjVal<T,K extends keyof T>(obj:T,key:K):T[K]{
    return obj[key]
}

getObjVal(aaaObj,"aa")
```

## 映射类型

```typescript
interface AAB{
    a:string,
    b:string,
    c:number
}

let aab:AAB = {
    a:"1",
    b:"2",
    c:2
}

type AABPart<T>={
    [k in keyof T]?:T[k]
}

let aab1:Partial<AAB> = {
    c:1
}
```



## 初始化工程

```shell
npm init vite
```

安装初始依赖

```shell
npm install
```

## SFC模板语法

script,template,style三部分共同组成了SFC模板语法

## 响应式数据API

### 1. **`ref`**

- **用途**：为基本类型或对象创建响应式引用。适合处理单个值，通过 `.value` 访问。

- **特点**：对对象类型会调用 `reactive` 进行深度响应式转换。

- **适用场景**：需要响应式的基本类型值，或需要替换整个对象引用时。

  ```typescript
  import { ref } from 'vue';
  
  // 基本类型
  const count = ref<number>(0);
  count.value++; // 触发响应式更新
  
  // 对象类型
  const user = ref<{ name: string; age: number }>({ name: 'Alice', age: 25 });
  user.value.name = 'Bob'; // 深度响应式，会触发更新
  ```

### 2. **`reactive`**

- **用途**：创建深度响应式对象。仅适用于对象/数组。

- **特点**：递归转换所有嵌套属性为响应式。

- **适用场景**：需要深度响应式的复杂对象结构。

  ```typescript
  import { reactive } from 'vue';
  
  const state = reactive<{ 
    user: { name: string; age: number }; 
    hobbies: string[] 
  }>({
    user: { name: 'Charlie', age: 30 },
    hobbies: ['reading', 'gaming']
  });
  
  state.user.age = 31;     // 触发响应式更新（深层）
  state.hobbies.push('cooking'); // 触发数组更新
  ```

### 3. **`shallowReactive`**

- **用途**：创建浅层响应式对象，仅第一层属性是响应式的。

- **特点**：深层属性修改不会触发更新。

- **适用场景**：性能敏感场景，避免深层监听。

  ```typescript
  import { shallowReactive } from 'vue';
  
  const shallowState = shallowReactive<{ 
    info: { title: string; content: string } 
  }>({
    info: { title: 'Hello', content: 'World' }
  });
  
  // ✅ 第一层属性修改：触发更新
  shallowState.info = { title: 'Hi', content: 'Vue' };
  
  // ❌ 深层属性修改：不会触发更新！
  shallowState.info.title = 'Updated'; 
  ```

### 4. **`shallowRef`**

- **用途**：创建一个浅层的 `ref`，`.value` 的替换是响应式的，但 `.value` 内部属性不是。

- **特点**：直接修改 `.value` 的属性不会触发更新，需替换整个 `.value`。

- **适用场景**：大对象或需要性能优化的场景。

  ```typescript
  import { shallowRef } from 'vue';
  
  // 基本类型（行为同 ref）
  const num = shallowRef<number>(10);
  num.value = 20; // 触发更新
  
  // 对象类型
  const data = shallowRef<{ items: string[] }>({ items: ['a', 'b'] });
  
  // ❌ 修改深层属性：不会触发更新！
  data.value.items.push('c');
  
  // ✅ 替换整个 value：触发更新
  data.value = { items: ['x', 'y'] };
  ```

### 5. **使用 `reactive` 创建响应式 `Set`/`Map`**

```typescript
import { reactive } from 'vue';

// 响应式 Set
const reactiveSet = reactive<Set<string>>(new Set());
reactiveSet.add('apple'); // ✅ 触发更新
reactiveSet.delete('apple'); // ✅ 触发更新

// 响应式 Map
const reactiveMap = reactive<Map<string, number>>(new Map());
reactiveMap.set('count', 10); // ✅ 触发更新
reactiveMap.delete('count'); // ✅ 触发更新
```

#### **注意事项**

- **直接修改不会触发更新**：
  例如 `reactiveSet.values().next().value = 'new'` 不会触发响应式更新。
- **替换整个集合会丢失响应性**：
  若直接赋值 `reactiveSet = new Set()`，响应性会中断（需使用 `ref` 替代）。

### 6. **使用 `ref` 创建响应式 `Set`/`Map`**

`ref` 通过 `.value` 访问集合实例，需替换整个 `.value` 或调用原生方法修改内容。

```typescript
import { ref } from 'vue';

// 响应式 Set
const refSet = ref<Set<string>>(new Set());
refSet.value.add('banana'); // ✅ 触发更新
refSet.value = new Set(['orange']); // ✅ 替换整个 Set 会触发更新

// 响应式 Map
const refMap = ref<Map<string, number>>(new Map());
refMap.value.set('price', 20); // ✅ 触发更新
refMap.value = new Map([['discount', 0.8]]); // ✅ 替换整个 Map 会触发更新
```

#### **注意事项**

- **修改 `.value` 的属性不会触发更新**：
  例如 `refSet.value.values().next().value = 'new'` 不会触发更新。
- **推荐使用原生方法修改内容**：
  通过 `add`/`delete`/`set` 等方法修改集合内容，而非直接操作内部数据。

## 计算属性

### 一、基本用法

#### 1. 只读计算属性

使用 `computed` 函数传入一个 getter 函数，返回一个**响应式 ref 对象**。

```typescript
import { ref, computed } from 'vue';

// 响应式数据
const count = ref(0);

// 计算属性：基于 count 派生双倍值
const doubleCount = computed(() => count.value * 2);

// 使用
console.log(doubleCount.value); // 0 → 当 count 变化时自动更新
```

#### 2. 可写计算属性

通过提供 `get` 和 `set` 方法，实现可写的计算属性。

```typescript
const firstName = ref('John');
const lastName = ref('Doe');

// 可写计算属性
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (newValue) => {
    const [first, last] = newValue.split(' ');
    firstName.value = first;
    lastName.value = last;
  },
});

// 修改计算属性
fullName.value = 'Jane Smith'; // 触发 set 方法
```

### 二、结合 TypeScript 的类型声明

#### 1. 自动类型推断

大多数情况下，TypeScript 能自动推断计算属性的类型：

```typescript
const double = computed(() => count.value * 2); // 推断为 ComputedRef<number>
```

#### 2. 显式指定类型

当处理复杂类型时，可通过泛型参数显式声明类型：

```typescript
interface User {
  name: string;
  age: number;
}

const userList = ref<User[]>([]);

// 显式声明返回类型
const userCount = computed<number>(() => userList.value.length);
```

### 三、常见应用场景

#### 1. 数据格式化

对原始数据进行格式化处理（如日期、金额）。

```typescript
const price = ref(100);
const formattedPrice = computed(() => `$${price.value.toFixed(2)}`);
```

#### 2. 过滤/筛选数据

基于条件过滤列表数据。

```typescript
const todos = ref([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Use TypeScript', done: false },
]);

const completedTodos = computed(() => 
  todos.value.filter(todo => todo.done)
);
```

#### 3. 依赖多个响应式数据

当计算属性依赖多个源时，自动跟踪所有依赖。

```typescript
const width = ref(10);
const height = ref(20);
const area = computed(() => width.value * height.value);
```

#### 4. 作为组件属性传递

计算属性可以传递给子组件作为 props。

```typescript
<!-- 父组件 -->
<template>
  <ChildComponent :total="totalCount" />
</template>

<script setup lang="ts">
const items = ref([1, 2, 3]);
const totalCount = computed(() => items.value.length);
</script>
```

## 样式绑定

```typescript
<template>
    <div>
        <div :class="[{active:isActive},'test']"></div>
        <div class="box" :style="styleData">Hello World</div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import type { CSSProperties } from "vue"

const isActive = ref(true)

const styleData = computed<CSSProperties>(()=>{
    return {
        backgroundColor: 'red'
    }
})
</script>

<style scoped>
.box{
    width: 200px;
    height: 120px;
}
</style>
```

## 列表循环

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

const list = ref([
  "a",
  "b",
  "c",
  "d"
])
const show = ref(false)
const obj = reactive({
  a:1,
  b:2,
  c:3
})
</script>

<template>
 <h1>
  <ul>
    <!-- <template v-for="(item,index) in 10" :key="item">
     <li>{{ item }}-{{ index }}</li>
     <span>{{ item }}</span>
    </template> -->
    <template v-for="(value,key,index) in obj" :key="key">
     <li>{{ value }}-{{ key }} - {{ index }}</li>
     <span>{{ value }}</span>
    </template>
  </ul>

 </h1>
</template>

<style scoped>

</style>
```

## 事件机制

### 一、基础事件绑定

#### 1. 基本语法

```vue
<template>
  <!-- 内联表达式 -->
  <button @click="count++">Add</button>

  <!-- 调用方法 -->
  <button @click="handleClick">Click Me</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const handleClick = (event: MouseEvent) => {
  console.log('Clicked!', event);
};
</script>
```

### 二、事件修饰符

Vue 提供了一系列事件修饰符，通过链式调用实现特定功能。

#### 1. 常用 DOM 事件修饰符

| 修饰符     | 作用                                                   |
| :--------- | :----------------------------------------------------- |
| `.stop`    | 阻止事件冒泡（调用 `event.stopPropagation()`）         |
| `.prevent` | 阻止默认行为（调用 `event.preventDefault()`）          |
| `.capture` | 使用事件捕获模式（而非冒泡模式）                       |
| `.self`    | 仅当事件从元素自身触发时（非子元素冒泡）才触发         |
| `.once`    | 事件只触发一次（自动移除监听器）                       |
| `.passive` | 优化滚动性能（与 `preventDefault` 冲突，不可同时使用） |

```typescript
<!-- 阻止表单提交默认行为 -->
<form @submit.prevent="onSubmit"></form>

<!-- 阻止点击事件冒泡 -->
<div @click.stop="handleClick"></div>

<!-- 仅当点击元素自身时触发 -->
<div @click.self="handleSelfClick"></div>
```

#### 2. 按键修饰符

用于监听键盘事件（如 `@keyup`、`@keydown`）。

| 修饰符             | 作用                                       |
| :----------------- | :----------------------------------------- |
| `.enter`           | 回车键                                     |
| `.tab`             | Tab 键                                     |
| `.delete`          | Delete 或 Backspace 键                     |
| `.esc`             | Esc 键                                     |
| `.space`           | 空格键                                     |
| `.up` / `.down`    | 上/下方向键                                |
| `.left` / `.right` | 左/右方向键                                |
| `.exact`           | 精确匹配按键组合（无其他按键按下时才触发） |

```typescript
<!-- 回车键触发 -->
<input @keyup.enter="submitForm" />

<!-- Ctrl + Enter 组合键 -->
<input @keyup.ctrl.enter="handleCtrlEnter" />

<!-- 精确匹配：仅 Alt + X 触发 -->
<button @keyup.alt.x.exact="handleAltX" />
```

#### 3. 系统修饰键

用于监听系统按键（需配合 `@keyup` 或 `@keydown` 使用）。

| 修饰符   | 作用                    |
| :------- | :---------------------- |
| `.ctrl`  | Ctrl 键                 |
| `.alt`   | Alt 键                  |
| `.shift` | Shift 键                |
| `.meta`  | Command (Mac) 或 Win 键 |

```typescript
<!-- Ctrl + 点击触发 -->
<div @click.ctrl="handleCtrlClick"></div>

<!-- Alt + C 组合键 -->
<input @keyup.alt.c="copyText" />
```

## 生命周期

### 一、Vue 3 生命周期图示

以下是 Vue 3 生命周期流程（按执行顺序排列）：

1. **`setup()`**
   （组合式 API 的入口，替代 `beforeCreate` 和 `created`）
2. **`onBeforeMount`**
   组件挂载到 DOM 前调用
3. **`onMounted`**
   组件挂载到 DOM 后调用（可访问 DOM）
4. **`onBeforeUpdate`**
   响应式数据变化导致 DOM 更新前调用
5. **`onUpdated`**
   DOM 更新完成后调用
6. **`onBeforeUnmount`**
   组件卸载前调用（Vue 3 中替代 `beforeDestroy`）
7. **`onUnmounted`**
   组件卸载后调用（替代 `destroyed`）
8. **`onErrorCaptured`**
   捕获子组件传递的错误时调用

```typescript
import { 
  onBeforeMount, 
  onMounted, 
  onBeforeUpdate, 
  onUpdated, 
  onBeforeUnmount, 
  onUnmounted 
} from 'vue';

// 示例：组合式 API 中的生命周期
onBeforeMount(() => {
  console.log('组件挂载前');
});

onMounted(() => {
  console.log('组件挂载完成，可操作 DOM');
  const element = document.getElementById('my-element');
});

onBeforeUpdate(() => {
  console.log('数据变化，DOM 更新前');
});

onUpdated(() => {
  console.log('DOM 更新完成');
});

onBeforeUnmount(() => {
  console.log('组件卸载前，清理副作用');
});

onUnmounted(() => {
  console.log('组件已卸载');
});
```

## 监听事件

```vue
<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue';

const counter = ref(1);
const double = ref(0)
const obj = reactive({
  count:1,
  a:{
    count:1,
    b:{
      c:{
        count:1
      }
    }
  }
})
// 对象属于复杂类型，内存存储的是一个地址
// watch(()=>obj.a,(newObj,oldObj)=>{
//   console.log(newObj,oldObj,newObj === oldObj);
// },{
//   deep:true
// })

watchEffect(()=>{
  double.value = obj.a.b.c.count * 2
  console.log(double.value);
  
})
// watch([()=>counter.value,double],([newCounter,newDouble],[oldCounter,oldDouble])=>{
//   console.log(newCounter,oldCounter);
  
// },{
//   immediate:true
// })
</script>

<template>
 <h1 >
  {{ obj.a.b.c.count }}
  <button @click="obj.a.b.c.count ++">增加</button>
 </h1>
</template>

<style scoped>

</style>

```

## defineProps

### 1. **基本用法（类型声明）**

通过泛型参数直接定义 props 的类型，简洁且类型明确：

```vue
<script setup lang="ts">
interface Props {
  // 必传属性
  title: string;
  // 可选属性（默认 undefined）
  count?: number;
  // 复杂类型
  items: Array<{ id: number; name: string }>;
}

const props = defineProps<Props>();
</script>
```

- **必传属性**：无 `?` 修饰符的属性，父组件必须传递。
- **可选属性**：使用 `?` 修饰符，父组件可不传，值为 `undefined`。
- **默认值**：需结合 `withDefaults` 设置。

### 2. **设置默认值（withDefaults）**

使用 `withDefaults` 为基于类型的 props 提供默认值：

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  items?: Array<{ id: number }>;
}

const props = withDefaults(defineProps<Props>(), {
  // 基本类型默认值
  count: 0,
  // 引用类型需使用函数返回（避免共享引用）
  items: () => [{ id: 1 }],
});
</script>
```

### 3. **运行时声明（对象语法）**

通过对象语法定义 props，支持更详细的验证规则：

```vue
<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  // 必传的字符串
  title: {
    type: String,
    required: true,
  },
  // 可选的数字，默认值为 0
  count: {
    type: Number,
    default: 0,
  },
  // 复杂类型（需使用 PropType）
  items: {
    type: Array as PropType<Array<{ id: number }>>,
    default: () => [],
  },
  // 联合类型
  id: {
    type: [String, Number],
    required: true,
  },
});
</script>
```

- **复杂类型**：使用 `PropType` 包裹类型，确保运行时类型正确。
- **联合类型**：通过数组 `[String, Number]` 声明允许的类型。

### 4. **混合类型与运行时声明**

类型声明和对象语法可结合使用，但通常建议选择一种方式：

```vue
<script setup lang="ts">
import { PropType } from 'vue';

// 不推荐混合写法，仅作示例
defineProps({
  title: {
    type: String as PropType<'header' | 'footer'>,
    required: true,
  },
});
</script>
```

### 5. **注意事项**

- **Boolean 类型**：父组件传递布尔值时需注意行为：

  ```typescript
  <!-- 值为 true -->
  <MyComponent is-active />
  <!-- 显式赋值为 false -->
  <MyComponent :is-active="false" />
  ```

- **类型推断**：使用对象语法时，TypeScript 会自动推断类型，无需额外定义。

- **代码提示**：两种方式均支持模板中的类型提示和编译时检查。

### 总结

| **场景**                 | **推荐方式**            | **示例**                                                     |
| :----------------------- | :---------------------- | :----------------------------------------------------------- |
| 简单类型，无需默认值     | 类型声明（泛型）        | `defineProps<{ title: string }>()`                           |
| 需要默认值或复杂验证逻辑 | 运行时声明（对象语法）  | 使用 `default` 和 `validator` 选项                           |
| 复杂类型（如对象、数组） | 运行时声明 + `PropType` | `type: Array as PropType<Array<{ id: number }>>`             |
| 联合类型                 | 运行时声明或类型声明    | `type: [String, Number]` 或 `defineProps<{ id: string | number }>()` |

## 父子组件通信

### 1. **父组件传值给子组件（Props）**

#### 子组件定义 Props

使用 `defineProps` 声明接收的 props，并添加 TypeScript 类型约束：

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  // 必传属性
  title: string;
  // 可选属性
  count?: number;
  // 复杂类型（如对象或数组）
  items: Array<{ id: number }>;
}

const props = defineProps<Props>();
</script>

<template>
  <div>{{ title }} - {{ count }}</div>
</template>
```

#### 父组件传递 Props

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';
</script>

<template>
  <ChildComponent
    title="Hello Vue 3"
    :count="10"
    :items="[{ id: 1 }, { id: 2 }]"
  />
</template>
```

### 2. **子组件通知父组件（Emit Events）**

#### 子组件定义 Emits

使用 `defineEmits` 声明事件，并指定事件参数类型：

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Emits {
  // 定义事件名和参数类型
  (e: 'update-count', value: number): void;
  (e: 'submit-data', data: string): void;
}

const emit = defineEmits<Emits>();

const handleClick = () => {
  // 触发事件并传递参数
  emit('update-count', 100);
};
</script>

<template>
  <button @click="handleClick">通知父组件</button>
</template>
```

### 3. **双向数据绑定（v-model）**

Vue 3 支持多个 `v-model` 绑定，适合表单类组件。

#### 子组件定义

```vue
<!-- ChildInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input :value="modelValue" @input="handleInput" />
</template>
```

#### 父组件使用

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import ChildInput from './ChildInput.vue';

const inputValue = ref('');
</script>

<template>
  <ChildInput v-model="inputValue" />
  <p>输入的值：{{ inputValue }}</p>
</template>
```

### 4. **访问子组件实例（Expose）**

子组件通过 `defineExpose` 暴露方法或属性，父组件通过 `ref` 调用。

#### 子组件暴露方法

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const sayHello = () => {
  console.log('Hello from child!');
};

defineExpose({
  sayHello
});
</script>
```

#### 父组件调用

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref<InstanceType<typeof ChildComponent>>();

const triggerChildMethod = () => {
  childRef.value?.sayHello();
};
</script>

<template>
  <ChildComponent ref="childRef" />
  <button @click="triggerChildMethod">调用子组件方法</button>
</template>
```

### 5. **插槽通信（Slots）**

父组件通过插槽传递模板片段，子组件通过 `<slot>` 接收。

#### 子组件定义插槽

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <slot name="header" :title="'标题'"></slot>
    <slot :data="{ message: '来自子组件的数据' }"></slot>
  </div>
</template>
```

#### 父组件使用

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent>
    <!-- 具名插槽 -->
    <template #header="{ title }">
      <h1>{{ title }}</h1>
    </template>

    <!-- 默认插槽（作用域插槽） -->
    <template #default="{ data }">
      <p>{{ data.message }}</p>
    </template>
  </ChildComponent>
</template>
```

### 6. **注意事项**

1. **单向数据流**：Props 是单向绑定的，子组件不应直接修改父组件传递的 props。

2. **类型安全**：始终为 Props 和 Emits 添加 TypeScript 类型声明，避免运行时错误。

3. **复杂类型**：使用 `PropType` 处理复杂类型（如对象或函数）：

   ```typescript
   import type { PropType } from 'vue';
   
   defineProps({
     user: {
       type: Object as PropType<{ name: string; age: number }>,
       required: true
     }
   });
   ```

4. **事件校验**：在 `defineEmits` 中定义事件参数类型，确保父组件接收正确的数据。

## 兄弟组件通信

### **使用事件总线（Event Bus）**

#### 实现步骤：

1. **创建事件总线**：使用第三方库（如 `mitt`）
2. **兄弟组件**分别监听和触发事件

#### 代码示例：

```typescript
// utils/eventBus.ts
import mitt from 'mitt';

type Events = {
  'message-event': string;
};

export const eventBus = mitt<Events>();
```

```vue
<!-- ChildA.vue（触发事件） -->
<script setup lang="ts">
import { eventBus } from '@/utils/eventBus';

const send = () => {
  eventBus.emit('message-event', 'Hello from ChildA!');
};
</script>

<template>
  <button @click="send">通过事件总线发送</button>
</template>
```

```vue
<!-- ChildB.vue（监听事件） -->
<script setup lang="ts">
import { eventBus } from '@/utils/eventBus';
import { onMounted, onUnmounted, ref } from 'vue';

const message = ref('');

onMounted(() => {
  eventBus.on('message-event', (msg) => {
    message.value = msg;
  });
});

onUnmounted(() => {
  eventBus.off('message-event');
});
</script>

<template>
  <div>收到事件总线消息：{{ message }}</div>
</template>
```

## 依赖注入

在 Vue 3 + TypeScript 中，**依赖注入（Dependency Injection）** 主要通过 `provide` 和 `inject` API 实现，用于跨组件层级传递数据或方法，尤其适合深层嵌套组件间的通信。以下是详细用法和最佳实践：

### 1. **基本概念**

- **`provide`**：在祖先组件中提供数据/方法。
- **`inject`**：在后代组件中注入数据/方法。
- **适用场景**：
  - 主题配置（如颜色方案）
  - 用户身份信息
  - 全局工具函数
  - 避免逐层传递 props 的复杂场景

### 2. **基本用法**

#### 祖先组件提供数据

```vue
<!-- AncestorComponent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue';

// 提供静态数据
provide('appTheme', 'dark');

// 提供响应式数据
const user = ref({ name: 'Alice', age: 30 });
provide('user', user);

// 提供方法
const updateUser = (newName: string) => {
  user.value.name = newName;
};
provide('updateUser', updateUser);
</script>
```

#### 后代组件注入数据

```vue
<!-- DescendantComponent.vue -->
<script setup lang="ts">
import { inject } from 'vue';

// 注入非响应式数据（需显式声明类型）
const theme = inject<string>('appTheme');

// 注入响应式数据（使用泛型）
const user = inject<Ref<{ name: string; age: number }>>('user');

// 注入方法
const updateUser = inject<(newName: string) => void>('updateUser');

// 安全用法：提供默认值
const apiUrl = inject<string>('apiUrl', 'https://default.api');
</script>
```

### 3. **类型安全与 TypeScript**

#### 定义注入类型

使用 **接口（Interface）** 或 **类型别名（Type Alias）** 明确注入值的类型：

```typescript
// types/injection.ts
interface User {
  name: string;
  age: number;
}

type UpdateUserFunc = (newName: string) => void;

// 使用 Symbol 避免命名冲突
export const InjectionKeys = {
  USER: Symbol() as InjectionKey<Ref<User>>,
  UPDATE_USER: Symbol() as InjectionKey<UpdateUserFunc>,
  THEME: Symbol() as InjectionKey<string>,
};
```

#### 提供和注入时使用 Symbol 键

```vue
<!-- AncestorComponent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue';
import { InjectionKeys } from '@/types/injection';

const user = ref<User>({ name: 'Alice', age: 30 });
provide(InjectionKeys.USER, user);
provide(InjectionKeys.THEME, 'dark');
</script>
```

```vue
<!-- DescendantComponent.vue -->
<script setup lang="ts">
import { inject } from 'vue';
import { InjectionKeys } from '@/types/injection';

const user = inject(InjectionKeys.USER);
const theme = inject(InjectionKeys.THEME);
</script>
```

### 4. **响应式数据**

- 若需要注入的数据保持响应性，需使用 `ref` 或 `reactive` 包裹：

  ```typescript
  // 提供响应式对象
  const config = reactive({ darkMode: true });
  provide('config', config);
  
  // 注入后仍可响应式更新
  const injectedConfig = inject<{ darkMode: boolean }>('config');
  ```

### 5. **在组合式函数中使用**

依赖注入可与 **Composition API** 结合：

```typescript
// composables/useAuth.ts
import { inject } from 'vue';
import { InjectionKeys } from '@/types/injection';

export const useAuth = () => {
  const user = inject(InjectionKeys.USER);
  const updateUser = inject(InjectionKeys.UPDATE_USER);

  const logout = () => {
    if (user?.value) user.value.name = 'Guest';
  };

  return { user, updateUser, logout };
};
```

### 6. **注意事项**

1. **避免滥用**：优先使用 Props/Emits 或 Pinia，仅在跨层级通信时使用依赖注入。

2. **默认值**：建议为 `inject` 提供默认值，避免未提供时的 `undefined` 错误：

   ```typescript
   const theme = inject('theme', 'light');
   ```

3. **响应式解构**：若解构注入的响应式对象，需使用 `toRefs` 保持响应性：

   ```typescript
   const user = inject(InjectionKeys.USER);
   const { name, age } = toRefs(user?.value || { name: '', age: 0 });
   ```

4. **代码组织**：将注入键集中管理（如 `src/constants/injection.ts`），避免命名冲突。

## 模板引用技巧

### 1. **基本用法**

#### 引用 DOM 元素

```vue
<template>
  <input ref="inputRef" type="text" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 创建 ref（类型为 HTMLInputElement）
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  // 确保 DOM 已渲染
  inputRef.value?.focus(); // 自动聚焦输入框
});
</script>
```

#### 引用组件实例

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent ref="childRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

// 类型：InstanceType<typeof ChildComponent>
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);

const callChildMethod = () => {
  childRef.value?.sayHello(); // 调用子组件方法
};
</script>
```

### 2. **子组件暴露方法**

默认情况下，`<script setup>` 的组件是私有的。需用 `defineExpose` 显式暴露方法或属性：

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const sayHello = () => {
  console.log('Hello from child!');
};

const count = ref(0);

// 暴露方法和数据
defineExpose({
  sayHello,
  count
});
</script>
```

### 3. **结合 v-for 的引用**

当在 `v-for` 中使用 ref 时，会得到一个数组类型的引用：

```vue
<template>
  <div v-for="item in 3" :key="item" ref="divRefs">{{ item }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const divRefs = ref<HTMLDivElement[]>([]);

onMounted(() => {
  console.log(divRefs.value); // [div, div, div]
});
</script>
```

### 4. **函数式引用**

通过函数动态设置 ref（适用于动态渲染场景）：

```vue
<template>
  <input :ref="(el) => setInputRef(el)" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputRefs = ref<HTMLInputElement[]>([]);

const setInputRef = (el: HTMLInputElement) => {
  if (el) inputRefs.value.push(el);
};
</script>
```

## 双向绑定

### 1.使用`v-model:value`

##### children.vue

```vue
<script setup lang="ts">
defineProps<{
    value: string
}>()
defineEmits(['update:value'])
</script>

<template>
<input :value="value" @input="(e)=>$emit('update:value',(e.target as HTMLInputElement).value)"/>
</template>

<style scoped>

</style>
```

##### parent.vue

```vue
<template>
    <div>
        <C v-model:value="value"/>
        <h1>
          {{value}}
        </h1>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import C from "./components/C.vue"
const value = ref()
</script>

<style scoped>

</style>

```

### 2.使用v-model

##### children.vue

```vue
<script setup lang="ts">
defineProps<{
    modelValue: string
}>()
defineEmits(['update:modelValue'])
</script>

<template>
<input :value="modelValue" @input="(e)=>$emit('update:modelValue',(e.target as HTMLInputElement).value)"/>
</template>

<style scoped>

</style>

```

##### parent.vue

```vue
<template>
<div>
    <C v-model="value"/>
    <h1>
      {{value}}
    </h1>
</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import C from "./components/C.vue"
const value = ref()
</script>

<style scoped>

</style>
```

### 3.在属性里面定义事件

##### children.vue

```vue
<script setup lang="ts">
defineProps<{
    modelValue: string
    'onUpdate:modelValue':(value:string)=>void
}>()
</script>

<template>
<input :value="modelValue" @input="(e)=>$emit('update:modelValue',(e.target as HTMLInputElement).value)"/>
</template>

<style scoped>

</style>

```

##### parent.vue

```vue
<template>
<div>
    <C v-model="value"/>
    <h1>
      {{value}}
    </h1>
</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import C from "./components/C.vue"
const value = ref()
</script>

<style scoped>

</style>

```

## 组件属性继承

### 1. 默认行为

在 Vue3 中，当父组件传递 **未被子组件声明为 `props` 的属性** 时，这些属性会自动继承到子组件的 **根元素** 上（类似 HTML 的 attribute 透传）。

```vue
<!-- 父组件 Parent.vue -->
<ChildComponent class="custom-class" title="Hello" />
```

```vue
<!-- 子组件 Child.vue -->
<template>
  <div> <!-- 父组件传递的 class 和 title 会绑定到此 div -->
    Child Component
  </div>
</template>
```

### 2.禁用自动继承

```vue
<script setup lang="ts">
defineOptions({
    inheritAttrs:false,
    name:'D'
})
</script>
```

### 3.手动控制继承

使用 `v-bind="$attrs"` 手动指定属性绑定位置，常用于高阶组件（HOC）或需要透传属性的场景。

```vue
<!-- 子组件 Child.vue -->
<template>
  <div>
    <!-- 手动绑定 $attrs 到内部元素 -->
    <button v-bind="$attrs">Click Me</button>
  </div>
</template>
```

### 4. TypeScript 类型处理

为透传的 `$attrs` 添加类型声明，确保类型安全。

```vue
// 子组件 Child.vue
<script setup lang="ts">
import { useAttrs } from 'vue';

// 获取 attrs 并定义类型
interface CustomAttrs {
  title?: string;
  onClick?: (event: Event) => void;
}

const attrs = useAttrs() as CustomAttrs;
</script>
```

## 组件插槽

#### 子组件

```vue
<script setup lang="ts">
import {useSlots} from "vue";

const slots = useSlots()
console.log(slots)
</script>

<template>
    <header>
        <slot name="title"></slot>
    </header>
    <section>
        <!--内容-->
        <slot></slot>
    </section>
    <footer>
        <slot name="footer">
            footer
        </slot>
    </footer>
</template>

<style scoped>

</style>

```

#### 父组件

```vue
<template>
<div>
  <Layout>
    <template #title="{title}">
      <h2>Hello {{ title }} !</h2>
    </template>
    <h1>Hello World !</h1>
    <template #footer>
      <h2>Test1</h2>
    </template>
  </Layout>
</div>
</template>

<script setup lang="ts">
import Layout from "./components/Layout.vue"

</script>

<style scoped>

</style>

```

通过`useSlots`API可以获取所有的插槽

## 插槽继承

### 1. 默认行为

Vue3 默认会 **自动继承父组件传递的插槽** 到子组件内部，适用于需要透传插槽的包装组件场景。

```vue
<!-- 父组件 Parent.vue -->
<ChildComponent>
  <template #header> <!-- 插槽内容会自动传递到子组件 -->
    <h1>Custom Header</h1>
  </template>
</ChildComponent>
```

```vue
<!-- 子组件 Child.vue -->
<template>
  <div>
    <!-- 自动继承父级传递的插槽 -->
    <slot name="header"></slot>
    <slot></slot> <!-- 默认插槽 -->
  </div>
</template>
```

### 2. 手动控制插槽传递

使用 `v-slot` 和 `$slots` 显式传递插槽内容，常用于高阶组件或二次封装场景。

```vue
<!-- 子组件 WrapperComponent.vue -->
<template>
  <BaseComponent>
    <!-- 手动转发所有插槽 -->
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope" />
    </template>
  </BaseComponent>
</template>
```

## 二、`defineSlots` API（Vue3.3+）

### 1. 核心作用

`defineSlots` 用于在 `<script setup>` 中 **声明插槽的类型**，提供以下能力：

- **类型检查**：确保插槽名称和作用域参数的类型安全
- **IDE 支持**：在模板中获得智能提示
- **必传校验**：标记必须传递的插槽

### 2. 基本用法

```vue
// 子组件 MyComponent.vue
<script setup lang="ts">
// 定义插槽类型
defineSlots<{
  // 默认插槽
  default?: (props: { message: string }) => any;
  
  // 具名插槽
  header?: () => VNode[];
  
  // 必传插槽（通过非可选属性标记）
  footer: () => VNode;
}>();
</script>
```

### 3. 完整类型声明

结合泛型实现更严格的类型约束：

```vue
<script setup lang="ts">
import type { SlotsType } from 'vue';

defineSlots<SlotsType<{
  default: { msg: string };    // 作用域参数类型
  title: never;                // 无作用域参数
  item: (props: { id: number }) => any;
}>>();
</script>
```

### 4. 实际应用场景

#### 场景 1：类型安全的作用域插槽

```vue
<!-- 子组件 ScopedSlotDemo.vue -->
<script setup lang="ts">
defineSlots<{
  default: (props: { data: string }) => any;
}>();
</script>

<template>
  <slot :data="'Hello from child'" />
</template>
```

#### 场景 2：必传插槽校验

```typescript
defineSlots<{
  header: () => VNode; // 必须传递该插槽
}>();
```

## 综合示例：类型安全的表格组件

### 1. 组件定义

```vue
<!-- DataTable.vue -->
<script setup lang="ts">
import type { SlotsType } from 'vue';

defineProps<{
  items: Array<{ id: number; name: string }>;
}>();

defineSlots<SlotsType<{
  header: never; // 无作用域参数
  row: { item: { id: number; name: string }; index: number };
  footer?: { total: number };
}>>();
</script>

<template>
  <table>
    <!-- 具名插槽 -->
    <thead>
      <slot name="header" />
    </thead>
    
    <!-- 作用域插槽 -->
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <slot name="row" :item="item" :index="index" />
      </tr>
    </tbody>
    
    <!-- 可选插槽 -->
    <tfoot v-if="$slots.footer">
      <slot name="footer" :total="items.length" />
    </tfoot>
  </table>
</template>
```

### 2. 组件使用

```vue
<template>
    <DataTable :items="users">
        <template #header>
            <th>ID</th>
            <th>Name</th>
        </template>

        <template #row="{ item, index }">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
        </template>

        <template #footer="{ total }">
            <tr>
                <td colspan="2">Total: {{ total }}</td>
            </tr>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import DataTable from "./components/DataTable.vue";
const users = [
    {
        id: 1,
        name: "John Doe"
    },
    {
        id: 2,
        name: "Jane Doe"
    },
    {
        id: 3,
        name: "Jim Doe"
    },
    {
        id: 4,
        name: "Joe Doe"
    },

]
</script>

<style scoped>

</style>

```

## 自定义指令

### 实现v-show

- [x] ##### 创建demo.ts

  ```typescript
  import type { Directive } from "vue";
  
  const elMap = new WeakMap()
  const demo:Directive = (el,binding)=>{
      if (!binding.value){
         el.style.display = 'none'
       }else{
           el.style.display = ''
       }
  }
  
  export {
      demo
  }
  ```

- [x] ##### 修改main.ts

  ```typescript
  import { createApp } from 'vue'
  import './style.css'
  import App from './App.vue'
  import { demo } from "./components/demo";
  
  const app = createApp(App)
  app.directive("demo",demo)
  app.mount('#app')
  ```

- [x] ##### vue文件

  ```vue
  <div v-demo="flag">
      自定义指令
  </div>
  <button @click="flag = !flag">
      自定义指令仿v-show
  </button>
  ```

### 实现v-if

- [x] 创建demo.ts

  ```typescript
  import type { Directive } from "vue";
  
  const elMap = new WeakMap()
  const demo:Directive = (el,binding)=>{
      //实现v-if
      let p = el.parentNode
      if (p){
          elMap.set(el,p);
      }else{
          p = elMap.get(el)
      }
      if (!binding.value){
          p.removeChild(el)
      }else{
          p.appendChild(el)
      }
  }
  
  export {
      demo
  }
  ```

- [x] 修改main.ts

  ```typescript
  import { createApp } from 'vue'
  import './style.css'
  import App from './App.vue'
  import { demo } from "./components/demo";
  
  const app = createApp(App)
  app.directive("demo",demo)
  app.mount('#app')
  
  ```

- [x] vue文件

  ```vue
     <div v-demo="flag">
          自定义指令
      </div>
      <button @click="flag = !flag">
          自定义指令仿v-if
      </button>
  ```


## Transition动画组件

### 一、`<Transition>` 组件核心概念

1. **作用**：自动为子元素/组件的以下行为应用动画：
   - 条件渲染 (`v-if`/`v-show`)
   - 动态组件 (`<component :is="...">`)
   - 组件根节点变化
2. **动画阶段**：
   - **进入 (Enter)**：元素插入到 DOM 时
   - **离开 (Leave)**：元素从 DOM 移除时
3. **类名规则**：
   - `v-enter-from`：进入动画的起始状态
   - `v-enter-active`：进入动画的持续状态（定义动画时长/缓动函数）
   - `v-enter-to`：进入动画的结束状态
   - `v-leave-from`：离开动画的起始状态
   - `v-leave-active`：离开动画的持续状态
   - `v-leave-to`：离开动画的结束状态

### 二、基础用法示例

#### 1. 淡入淡出效果

```vue
<template>
  <button @click="show = !show">切换</button>
  <Transition>
    <div v-if="show" class="fade-box">内容</div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(true);
</script>

<style scoped>
/* 进入/离开动画 */
.fade-box {
  width: 200px;
  height: 100px;
  background: #42b983;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
</style>
```

#### 2. 自定义类名前缀

```vue
<Transition name="slide">
  <!-- 元素 -->
</Transition>

<style>
/* 类名变为 slide-enter-from 等 */
.slide-enter-active {
  transition: all 0.3s ease-out;
}
.slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

#### 3.过渡模式：

```vue
<!-- 等待当前元素离开后执行进入动画 -->
<Transition mode="out-in">
  <!-- 元素 -->
</Transition>
```

#### 4.初始化动画

```vue
<!-- 初始化的时候也会触发动画 -->
<Transition mode="out-in" appear>
  <!-- 元素 -->
</Transition>
```

## TransitionGroup

```vue
<template>
    <TransitionGroup name="slide">
        <li v-for="item in list" :key="item">{{item}}</li>
    </TransitionGroup>
    <button @click="add">添加</button>
    <button @click="remove">删除</button>
</template>

<script setup lang="ts">
let i = 1;
const list = ref(Array.from({length:10}).map(()=>i++))
const getRandom = (max:number) => {
    return Math.floor(Math.random() * max)
}
const remove = () =>{
    const index = getRandom(list.value.length)
    list.value.splice(index,1)
}
const add = () =>{
    const index = getRandom(list.value.length)
    list.value.splice(index,0,i++)
}
</script>

<style scoped>
.slide-leave-to,.slide-enter-from{
    opacity: 0;
    transform: translateX(-100%);
}
/* 确保离开的元素脱离文档流 */
.slide-leave-active{
    position: absolute;
}
.slide-move,.slide-enter-active,.slide-leave-active{
    transition: all 0.5s ease;
}
.slide-leave-from,.slide-enter-to{
    opacity: 1;
    transform: translateX(0);
}
</style>

```

## 动态组件

### 一、动态组件基础

#### 1. 核心语法

通过 `<component :is="componentName">` 实现动态组件切换：

```vue
<template>
  <button @click="toggleComponent">切换组件</button>
  
  <!-- 动态组件 -->
  <component :is="currentComponent" :key="currentComponent.name" />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';

const components = {
  ComponentA,
  ComponentB
};

const currentComponent = shallowRef(components.ComponentA);

const toggleComponent = () => {
  currentComponent.value = 
    currentComponent.value === components.ComponentA 
      ? components.ComponentB 
      : components.ComponentA;
};
</script>
```

#### 2. 关键点

- **`:is` 属性**：接受组件对象、组件名称（需全局注册）或异步组件。
- **`key` 的作用**：强制重新渲染组件（避免复用导致的状态残留）。
- **`shallowRef`**：优化性能，避免不必要的响应式深层次转换。

### 二、TypeScript 类型处理

#### 1. 组件类型定义

为动态组件定义明确的类型：

```typescript
import type { Component } from 'vue';

interface ComponentMap {
  [key: string]: Component;
}

const components: ComponentMap = {
  ComponentA,
  ComponentB
};

// 当前组件的类型
const currentComponent = shallowRef<Component>(components.ComponentA);
```

#### 2. 动态组件传值（Props）

向动态组件传递 Props 并确保类型安全：

```vue
<component 
  :is="currentComponent" 
  :message="dynamicMessage" 
  @custom-event="handleEvent"
/>

<script setup lang="ts">
import { ref } from 'vue';

const dynamicMessage = ref('Hello from parent!');

const handleEvent = (payload: string) => {
  console.log('Received:', payload);
};
</script>
```

**子组件（ComponentA.vue）**：	

```vue
<script setup lang="ts">
defineProps<{ message: string }>();
defineEmits<{ (e: 'custom-event', payload: string): void }>();
</script>
```

### 三、高级用法

#### 1. 异步组件 + 代码分割

使用 `defineAsyncComponent` 实现按需加载：

```vue
<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';

// 动态导入组件（代码分割）
const AsyncComponentA = defineAsyncComponent(() => 
  import('./ComponentA.vue')
);
const AsyncComponentB = defineAsyncComponent(() => 
  import('./ComponentB.vue')
);

const currentComponent = shallowRef(AsyncComponentA);
</script>
```

#### 2. 结合 `<keep-alive>` 缓存状态

避免组件频繁销毁/重建：

```vue
<keep-alive>
  <component :is="currentComponent" />
</keep-alive>
```

#### 3. 动态组件与过渡动画

为组件切换添加动画效果：

```vue
<Transition name="fade" mode="out-in">
  <component :is="currentComponent" />
</Transition>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

#### 4.完整示例

##### 动态组件切换 + 异步加载 + 过渡动画

```vue
<template>
  <div>
    <button @click="currentComponent = ComponentA">显示 A</button>
    <button @click="currentComponent = ComponentB">显示 B</button>

    <Transition name="slide-fade" mode="out-in">
      <keep-alive>
        <component 
          :is="currentComponent" 
          :message="message"
          @update-message="message = $event"
        />
      </keep-alive>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef } from 'vue';
import type { Component } from 'vue';

const ComponentA = defineAsyncComponent(() => 
  import('./ComponentA.vue')
);
const ComponentB = defineAsyncComponent(() => 
  import('./ComponentB.vue')
);

const currentComponent = shallowRef<Component>(ComponentA);
const message = ref('Initial message');
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

## KeepAlive组件存活

### 一、核心作用

- **缓存组件实例**：当组件被切换隐藏时，保留其状态（如数据、DOM 结构等）
- **提升性能**：避免重复渲染和组件销毁/重建的开销
- **适用场景**：标签页切换、表单内容保留、高频切换的 UI 组件

### 二、基础用法

#### 1. 缓存动态组件

```vue
<template>
  <button @click="currentComponent = currentComponent === CompA ? CompB : CompA">
    切换组件
  </button>

  <!-- 使用 keep-alive 包裹动态组件 -->
  <keep-alive>
    <component :is="currentComponent" :key="currentComponent.name" />
  </keep-alive>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import CompA from './CompA.vue';
import CompB from './CompB.vue';

const currentComponent = shallowRef(CompA);
</script>
```

#### 2. 缓存路由组件

```vue
<template>
  <!-- 结合 vue-router -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>
```

#### 1. 包含/排除特定组件

```vue
<keep-alive :include="['CompA', 'CompB']" :exclude="/CompC/">
  <component :is="currentComponent" />
</keep-alive>
```

- `include`：字符串/正则/数组，匹配 `name` 的组件会被缓存
- `exclude`：字符串/正则/数组，匹配的组件不会被缓存

#### 2. 最大缓存实例数

```vue
<keep-alive :max="5">
  <!-- 超过最大数量时，最久未访问的实例会被销毁 -->
</keep-alive>
```

## 传送组件

### 一、核心作用

- **跨 DOM 层级渲染**：将组件内容渲染到任意 DOM 节点
- **解决样式隔离问题**：避免父组件 CSS 影响（如 `overflow: hidden`）
- **典型场景**：模态弹窗、全局 Toast、上下文菜单

### 二、基础用法

#### 1. 定义传送目标

在 `public/index.html` 中定义目标容器：

```html
<!-- public/index.html -->
<body>
  <div id="app"></div>
  
  <!-- 定义传送目标 -->
  <div id="teleport-target"></div>
</body>
```

#### 2. 组件中使用 Teleport

```vue
<template>
  <button @click="showModal = true">打开模态框</button>

  <!-- 将内容传送到 #teleport-target -->
  <Teleport to="#teleport-target">
    <div v-if="showModal" class="modal">
      <h2>标题</h2>
      <button @click="showModal = false">关闭</button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 1000;
}
</style>
```

### 三、高级用法

#### 1. 动态切换目标

```vue
<template>
  <Teleport :to="target">
    <!-- 内容 -->
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const target = ref<'#targetA' | '#targetB'>('#targetA');

const switchTarget = () => {
  target.value = target.value === '#targetA' ? '#targetB' : '#targetA';
};
</script>
```

#### 2. 禁用传送（条件渲染）

```vue
<Teleport :to="isMobile ? '#mobile-target' : '#desktop-target'">
  <!-- 内容 -->
</Teleport>
```

#### 3. 多个 Teleport 合并

多个 Teleport 到同一目标时，内容按顺序追加：

```vue
<Teleport to="#notifications">
  <div class="notification">通知1</div>
</Teleport>

<Teleport to="#notifications">
  <div class="notification">通知2</div>
</Teleport>

<!-- 渲染结果：
<div id="notifications">
  <div class="notification">通知1</div>
  <div class="notification">通知2</div>
</div>
-->
```

### 四、TypeScript 最佳实践

#### 1. 类型安全的目标选择器

```vue
<script setup lang="ts">
// 定义允许的传送目标
type TeleportTarget = '#modal' | '#toast';

const target = ref<TeleportTarget>('#modal');
</script>

<template>
  <Teleport :to="target"></Teleport>
</template>
```

#### 2. 动态 DOM 目标（Ref 方式）

```vue
<template>
  <Teleport :to="teleportTarget">
    <!-- 内容 -->
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const teleportTarget = ref<HTMLElement | null>(null);

onMounted(() => {
  // 动态创建目标容器
  const container = document.createElement('div');
  container.id = 'dynamic-container';
  document.body.appendChild(container);
  teleportTarget.value = container;
});

onBeforeUnmount(() => {
  if (teleportTarget.value) {
    document.body.removeChild(teleportTarget.value);
  }
});
</script>
```

### 五.完整示例：全局通知系统

#### 1. 定义目标容器

```html
<!-- public/index.html -->
<body>
  <div id="app"></div>
  <div id="global-notifications"></div>
</body>
```

#### 2. 通知组件

```vue
<!-- components/Notification.vue -->
<template>
  <Teleport to="#global-notifications">
    <div class="notification" :class="type">
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  type?: 'info' | 'success' | 'error';
}>();
</script>

<style>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
}

.info { background: #2196f3; }
.success { background: #4caf50; }
.error { background: #f44336; }
</style>
```

#### 3. 使用示例

```vue
<script setup lang="ts">
import Notification from './Notification.vue';
import { ref } from 'vue';

const showNoti = ref(false);
</script>

<template>
  <button @click="showNoti = true">显示通知</button>
  
  <Notification 
    v-if="showNoti"
    message="操作成功！"
    type="success"
    @close="showNoti = false"
  />
</template>
```

## Vue3 API介绍

### 1. `shallowRef` / `shallowReactive`

```typescript
// 浅层响应（不递归转换）
const shallowObj = shallowReactive({ nested: { data: 1 } });
shallowObj.nested.data = 2; // 不会触发响应

// 需要手动触发更新
triggerRef(shallowObj);
```

### 2. `toRef` / `toRefs`

```typescript
// 保持对 props 的响应式引用
const { title } = toRefs(props);

// 将 reactive 解构为 ref
const { age } = toRefs(user);
```

### 3. `customRef` - 自定义 Ref

```typescript
function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: number;
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    }
  }));
}
```

### `4.`defineOptions

解决 `<script setup>` 语法糖中无法直接定义组件选项的问题，例如：

- 组件名称 (`name`)
- 属性继承 (`inheritAttrs`)
- 自定义选项（如 `customOption`）

#### 1. 定义组件名称和选项

```vue
<script setup lang="ts">
// 🔨 定义组件选项
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
  // 其他 Vue 组件选项
  customOption: '自定义值'
});
</script>
```

#### 2、支持的选项

`defineOptions` 可以定义 **所有标准 Vue 组件选项**，包括但不限于：

- `name`
- `inheritAttrs`
- `components` (局部注册组件)
- `directives` (局部注册指令)
- `customOptions` (自定义选项)

#### 3.完整示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import LocalChild from './LocalChild.vue';

// 🔨 定义组件选项
defineOptions({
  name: 'UserProfile',
  inheritAttrs: false,
  components: {
    LocalChild
  },
  // 自定义选项
  permission: ['user:read']
});

const count = ref(0);
</script>

<template>
  <div>
    <LocalChild />
    <button @click="count++">点击次数: {{ count }}</button>
  </div>
</template>
```

## Vue-JSX

安装jsx的库

```shell
npm add @vitejs/plugin-vue-jsx -D
```

vite.config.ts里面注册

```typescript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(),vueJsx()],
})
```

tsconfig.json注册

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "moduleResolution": "node",
    "allowJs": true,        // 如果 bus.ts 是 JS 文件
    "checkJs": true,        // 可选，检查 JS 类型
    "declaration": true,     // 生成 .d.ts 文件
    "include": [
      "src/**/*.ts",
      "src/**/*.vue", // 确保包括 .vue 文件
      "tests/**/*.ts",
      "src/*.d.ts"
    ],
      
    "jsx": "preserve",
    "jsxImportSource": "vue",
  }
}
```

## JSX定义组件

#### 1.使用render()渲染

```tsx
import {defineComponent, ref} from "vue";

export default defineComponent({
    name:"Demo2",
    props:{},
    setup(){
        const a = ref(1)
        return {
            a
        }
    },
    render(){
        return (
            <div>
                demo2--{this.a}
            </div>
        )
    }
})

```

#### 2.使用函数式方式

```tsx
import {defineComponent,type PropType, ref} from "vue";

export default defineComponent({
    name:"Demo2",
    props:{
        msg:String as PropType<string>
    },
    setup(){
        const a = ref(1)
        return () => {
            return (
                <div>
                    demo2--{a.value}--函数式写法
                </div>
            )
        }
    }
})
```

## JSX使用响应式变量

```tsx
import {defineComponent,type PropType, ref} from "vue";

export default defineComponent({
    name:"Demo2",
    props:{
        msg:String as PropType<string>
    },
    setup(props){
        const a = ref(0)
        return () => {
            const {msg} = props;
            return (
                <div>
                    demo2--{a.value}--函数式写法
                    <br/>
                    <button onClick={()=>{
                        a.value++
                    }}>点击了{a.value}次</button>
                    <br/>
                    <div>{msg}</div>
                </div>
            )
        }
    }
})
```

```vue
<template>
    <Demo2 :msg="a"/>
    <button @click="a='测试成功'">修改</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Demo2 from "./demo2";

const a = ref("测试")
</script>

<style scoped>

</style>

```

## JSX实现v-show和v-if

1. #### v-if

   ```tsx
   import {defineComponent,type PropType, ref} from "vue";
   
   export default defineComponent({
       name:"Demo2",
       props:{
           msg:String as PropType<string>
       },
       setup(props){
           const a = ref(0)
           return () => {
               const {msg} = props;
               const vif = () => {
                   if (a.value%2===1){
                       return <div>奇数</div>
                   }
               }
               return (
                   <div>
                       demo2--{a.value}--函数式写法
                       <br/>
                       <button onClick={()=>{
                           a.value++
                       }}>点击了{a.value}次</button>
                       <br/>
                       <div>{msg}</div>
                       {vif()}
                   </div>
               )
           }
       }
   })
   
   ```

   

2. #### v-show

   ```tsx
   import {defineComponent,type PropType, ref} from "vue";
   
   export default defineComponent({
       name:"Demo2",
       props:{},
       setup(props){
           const a = ref(0)
           return () => {     
               return (
                   <div>
                       <button onClick={()=>{
                           a.value++
                       }}>点击了{a.value}次</button>
                       <span>v-show展示</span>
                       <div v-show={a.value%2===0}>v-show a 为偶数</div>
                   </div>
               )
           }
       },
   })
   ```

## JSX实现双向绑定

1. demo.tsx

   ```tsx
   import {defineComponent,type PropType} from "vue";
   
   export default defineComponent({
       name:"Demo",
       props:{
           value: String as PropType<string>,
           'onUpdate:value':Function
       },
       setup(props){
           // const a = ref(1)
           return () => {
               const inputProps = {
                   value: props.value,
                   oninput(e:Event){
                       props?.['onUpdate:value']?.((e.target as HTMLInputElement).value)
                   }
               }
               return(
                   <div>
                       <input {...inputProps}/>
                   </div>
               )
           }
       },
   })
   ```

2. App.vue

   ```vue
   <template>
       <div>
           <demo v-model:value="a"></demo>
           {{a}}
       </div>
   </template>
   
   <script lang="ts" setup>
   import demo from "./components/demo.tsx";
   import {ref} from "vue";
   
   const a = ref()
   </script>
   
   <style scoped>
   
   </style>
   ```

3. 使用属性的方式动态绑定

   ```tsx
   import {defineComponent,type PropType} from "vue";
   
   export default defineComponent({
       name:"Demo",
       props:{
           value: String as PropType<string>,
           'onUpdate:value':Function,
           param:String
       },
       setup(props){
           // const a = ref(1)
           return () => {
               const {param='value'} = props
               const inputProps = {
                   [param]: props.value,
                   onInput(e:Event){
                       props?.['onUpdate:value']?.((e.target as HTMLInputElement).value)
                   }
               }
               return(
                   <div>
                       <input {...inputProps}/>
                   </div>
               )
           }
       },
   })
   
   ```

## 插槽使用指南

```tsx
import { PropType, defineComponent, ref } from "vue"

const Input = defineComponent({
  name:"Input",
  setup(_,{slots}){
    return () =>{
      return (
        <>
          {slots?.prefix?.()}
          <input />
          {slots?.default?.()}
          {slots?.suffix?.()}
        </>
      )
    }
  }
})


export default defineComponent({
  name:"Demo2",
  props:{
   
  },
  setup(props,{slots}){
    return () => {
      const obj = {
        default:()=><span>默认插槽111</span>,
        prefix:() => <span>前缀</span>,
        suffix:() => <span>后缀</span>,
    }
      return(
        <div>
           <Input v-slots={obj}></Input>
        </div>
      )
    }
  },
})
```

## 在SFC中使用jsx

```vue
<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
  />
</template>

<script setup lang="tsx">
import { h, defineComponent, ref } from 'vue'
import { NButton,NInput } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

type Song = {
  no: number
  title: string
  length: string
}
const data = ref<Song[]>([
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' }
])
const createColumns = ({
  play
}: {
  play: (row: Song) => void
}): DataTableColumns<Song> => {
  return [
    {
      title: 'No',
      key: 'no'
    },
    {
      title: 'Title',
      key: 'title',
      render(row,index){
        const inputProps = {
          value: row.title,
          'onUpdate:value':(value:string)=>{
            data.value[index].title = value;
          }
        }
        return (
          <NInput {...inputProps}></NInput>
        )
      }
    },
    {
      title: 'Length',
      key: 'length'
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        return <NButton 
          strong 
          tertiary 
          size='small'
          onClick={() => play(row)}>
          Play
        </NButton>
      }
    }
  ]
}


const pagination = ref(false);
const columns = ref( createColumns({
  play (row: Song) {
    // message.info(`Play ${row.title}`)
  }
}))
</script>

```

## DefineModel用法介绍

#### `defineModel` 的基本概念

- **定义模型**：在子组件中使用 `defineModel` 来定义一个或多个响应式数据模型。
- **传递模型**：父组件通过属性传递这些模型给子组件。
- **双向绑定**：子组件可以修改这些模型的值，父组件可以响应这些变化。

#### 示例

**`在ChildComponent.vue（子组件）中：`**

```vue
<!-- ChildComponent.vue -->
 
<template>
  <div>
    <input v-model="childData" />
  </div>
</template>
 
<script setup>
import { defineModel } from 'vue';
 
const { childData } = defineModel(['childData']);
</script>
```

**`在ParentComponent.vue（父组件）中：`**

```vue
<!-- ParentComponent.vue -->
 
<template>
  <div>
    <ChildComponent v-model="parentData" />
    <p>Parent Data: {{ parentData }}</p>
  </div>
</template>
 
<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';    //导入子组件在父组件中使用
 
const parentData = ref('Initial Data');
</script>
```

#### 代码详细解释

- 父组件：
  - 使用 v-model 将 parentData 传递给 ChildComponent。
  - parentData 是一个响应式引用，初始值为 'Initial Data'。
- 子组件：
  - 使用 defineModel 定义 childData 模型。
  - v-model 绑定到 input 元素上，允许用户输入修改 childData 的值。
  - 当 childData 的值发生变化时，父组件的 parentData 也会相应更新，实现双向绑定
