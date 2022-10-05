# Typescript

## 基础类型

### 原始类型

js 中的原始类型有`number`、`string`、`boolean`、`null`、`undefined`、`symbol` 每一个类型在 TypeScript 中都有对应的类型。他们的名字跟你在 JavaScript 中使用 typeof 操作符得到的结果是一样的。

::: tip 类型名 String ，Number 和 Boolean （首字母大写）也是合法的，但它们是一些非常少见的特殊内置类型。所以类型总是使用 string ，number 或者 boolean 。

:::

### 数组

声明一个类似于 `[1, 2, 3]` 的数组类型，需要用到语法 `number[]`。这种写法和`Array<number>`，是一样的。

::: tip [number] 和 number[] 表示不同的意思

:::

### 对象类型

定义一个对象类型，我们只需要简单的列出它的属性和对应的类型。

```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

我们给参数添加了一个类型，该类型有两个属性, x 和 y，两个都是 number 类型。你可以使用`,`或者 `;` 分开属性，最后一个属性的分隔符加不加都行

每个属性对应的类型是可选的，如果不指定，默认使用 `any` 类型。

#### 可选属性

对象类型可以指定一些甚至所有的属性为可选的，只需要在属性名后添加一个 ?

```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

### 元组类型

元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。比较常见使用元组的场景是 React Hooks, 它的返回值类型是一个元组类型

```ts
(state: State) => [State, SetState];
```

::: tip 数组类型的值只有显示添加了元组类型注解后（或者使用 as const，声明为只读元组），TypeScript 才会把它当作元组，否则推荐出来的类型就是普通的数组类型

:::

### 特殊类型

#### any

any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式。

我们可以对被注解为 any 类型的变量进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 还无法检测其属性是否存在、类型是否正确。

#### unknown

主要用来描述类型并不确定的变量。

比如在多个 if else 条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，如下代码所示：

```ts
let result: unknown;
if (x) {
  result = x();
} else if (y) {
  result = y();
}
```

与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但 unknown 类型的值只能赋值给 unknown 或 any

使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型，我们对 unknown 执行的任何操作都报错

```ts
let result: unknown;
result.toFixed(); // 提示 ts(2571)
```

而所有的类型缩小手段对 unknown 都有效

```ts
let result: unknown;
if (typeof result === "number") {
  result.toFixed(); // 此处 hover result 提示类型是 number，不会提示错误
}
```

#### void

void 类型仅适用于表示没有返回值的函数。即如果该函数没有返回值，那它的类型就是 void。

#### never

never 表示永远不会发生值的类型，比如定义一个统一抛出错误的函数，它的返回值类型就是 never。

```ts
function ThrowError(msg: string): never {
  throw Error(msg);
}
```

## 函数

### 参数类型注解

声明一个函数的时候，你可以在每个参数后面添加一个类型注解，声明函数可以接受什么类型的参数。参数类型注解跟在参数名字后面：

```ts
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

::: tip 即便参数没有做类型注解，TypeScript 依然会检查传入参数的数量是否正确

:::

### 返回值类型注解

返回值的类型注解跟在参数列表后面

```ts
function getFavoriteNumber(): number {
  return 26;
}
```

跟变量类型注解一样，也不需要总是添加返回值类型注解，TypeScript 会基于它的 return 语句推断函数的返回类型。

### 匿名函数

匿名函数有一点不同于函数声明，当 TypeScript 知道一个匿名函数将被怎样调用的时候，匿名函数的参数会被自动的指定类型。

```ts
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

尽管参数 s 并没有添加类型注解，但 TypeScript 根据 forEach 函数的类型，以及传入的数组的类型，最后推断出了 s 的类型。

这个过程被称为**上下文推断（contextual typing）**

## 联合类型

一个联合类型是由两个或者更多类型组成的类型，表示值可能是这些类型中的任意一个。这其中每个类型都是联合类型的成员（members）

```ts
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
// Type '{ myID: number; }' is not assignable to type 'number'.
```

如果有一个联合类型 `string | number` , 不能使用只存在 `string` 上的方法：

```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

解决方案是用代码收窄联合类型，比如 TypeScript 知道，对一个 `string` 类型的值使用 `typeof` 会返回字符串 `"string"`

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

## 类型别名

所谓类型别名，顾名思义，一个可以指代任意类型的名字。类型别名的语法是：

```ts
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

可以使用类型别名给任意类型一个名字，举个例子，命名一个联合类型：

```ts
type ID = number | string;
```

## 接口

接口声明（interface declaration）是命名对象类型的另一种方式：

```ts
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

### 类型别名和接口的区别

接口的几乎所有特性都可以在 type 中使用，两者最关键的差别在于类型别名本身无法添加新的属性，而接口是可以扩展的。

```ts
// Interface
// 通过继承扩展类型
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// Type
// 通过交集扩展类型
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

## 类型断言

比如使用 document.getElementById，TypeScript 仅仅知道它会返回一个 HTMLElement，但是我们要获取的是一个 HTMLCanvasElement，这时候就需要用到类型断言

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

类型注解和类型断言一样，会被编译器移除，并且不会影响任何运行时的行为。

::: warning 因为类型断言会在编译的时候被移除，所以运行时并不会有类型断言的检查，即使类型断言是错误的，也不会有异常或者 null 产生。

:::

双重断言，先断言为 any （或者是 unknown），然后再断言为期望的类型

```ts
const a = expr as any as T;
```

## 字面量类型

字面量类型一般会结合联合类型一起用，比如函数只能传入一些固定的字符串时

```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

数字字面量类型也是一样的：

```ts
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

### 字面量推断

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);

// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

这段代码会报错，是因为`req.method`被推断为`string` ，而不是`"GET"`，因为在创建 req 和 调用 handleRequest 函数之间，可能还有其他的代码，或许会将 `req.method` 赋值一个新字符串,所以 TypeScript 就报错了。

解决方法有 2 个：

1.添加一个类型断言改变推断结果：

```ts
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
```

2.使用 `as const` 把整个对象转为一个类型字面量:

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

`as const` 效果跟 `const` 类似，但是对类型系统而言，它可以确保所有的属性都被赋予一个字面量类型
