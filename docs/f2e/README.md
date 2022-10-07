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

## 函数类型

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

### 函数重载

JavaScript 是一门动态语言，针对同一个函数，它可以有多种不同类型的参数与返回值，这就是函数的多态。

而在 TypeScript 中，也可以相应地表达不同类型的参数和返回值的函数，比如：

```ts
function convert(x: string | number | null): string | number | -1 {
  if (typeof x === "string") {
    return Number(x);
  }
  if (typeof x === "number") {
    return String(x);
  }
  return -1;
}

const x1 = convert("1"); // => string | number
const x2 = convert(1); // => string | number
const x3 = convert(null); // => string | number
```

convert 函数的 string 类型的值转换为 number 类型，number 类型转换为 string 类型，而将 null 类型转换为数字 -1。此时， x1、x2、x3 的返回值类型都会被推断成 string | number 。

但是这样不够精确，为了更精确地描述参数与返回值类型约束关系，需要用到函数重载（Function Overload）。

```ts
function convert(x: string): number;
function convert(x: number): string;
function convert(x: null): -1;
function convert(x: string | number | null): any {
  if (typeof x === "string") {
    return Number(x);
  }
  if (typeof x === "number") {
    return String(x);
  }
  return -1;
}

const x1 = convert("1"); // => number
const x2 = convert(1); // => string
const x3 = convert(null); // -1
```

### 类型谓词（is）

在添加返回值类型的地方，通过“参数名 + is + 类型”的格式明确表明了参数的类型，进而引起类型缩小，所以类型谓词函数的一个重要的应用场景是实现自定义类型守卫

```ts
function isString(s): s is string {
  // 类型谓词
  return typeof s === "string";
}

function isNumber(n: number) {
  return typeof n === "number";
}

function operator(x: unknown) {
  if (isString(x)) {
    // ok x 类型缩小为 string
  }
  if (isNumber(x)) {
    // ts(2345) unknown 不能赋值给 number
  }
}
```

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

### 交叉类型

可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性。在 TypeScript 中，可以使用“&”操作符来声明交叉类型

```ts
type Useless = string & number;
```

很显然，如果仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，比如既是 string 类型又是 number 类型。在上述的代码中，类型别名 Useless 的类型就是个 never。

### 合并接口类型

联合类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型

```ts
type IntersectionType = { id: number; name: string } & { age: number };
const mixed: IntersectionType = {
  id: 1,
  name: "name",
  age: 18,
};
```

如果同名属性的类型不兼容，比如上面示例中两个接口类型同名的 name 属性类型一个是 number，另一个是 string，合并后，name 属性的类型就是 number 和 string 两个原子类型的交叉类型，即 never

```ts
type IntersectionTypeConfict = { id: number; name: string } & {
  age: number;
  name: number;
};

const mixedConflict: IntersectionTypeConfict = {
  id: 1,
  name: 2, // ts(2322) 错误，'number' 类型不能赋给 'never' 类型
  age: 2,
};
```

如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，合并后 name 属性的类型就是两者中的子类型。

如下所示示例中 name 属性的类型就是数字字面量类型 2，因此，我们不能把任何非 2 之外的值赋予 name 属性。

```ts
type IntersectionTypeConfict = { id: number; name: 2 } & {
  age: number;
  name: number;
};

let mixedConflict: IntersectionTypeConfict = {
  id: 1,
  name: 2, // ok
  age: 2,
};

mixedConflict = {
  id: 1,
  name: 22, // '22' 类型不能赋给 '2' 类型
  age: 2,
};
```

### 合并联合类型

合并联合类型可以理解为求交集，在如下示例中，两个联合类型交叉出来的类型 IntersectionUnion 其实等价于 'em' | 'rem'，所以我们只能把 'em' 或者 'rem' 字符串赋值给 IntersectionUnion 类型的变量。

```ts
type UnionA = "px" | "em" | "rem" | "%";
type UnionB = "vh" | "em" | "rem" | "pt";
type IntersectionUnion = UnionA & UnionB;

const intersectionA: IntersectionUnion = "em"; // ok
const intersectionB: IntersectionUnion = "rem"; // ok
const intersectionC: IntersectionUnion = "px"; // ts(2322)
const intersectionD: IntersectionUnion = "pt"; // ts(2322)
```

### 类型缩减

如果将 string 原始类型和“string 字面量类型”组合成联合类型会是什么效果？效果就是类型缩减成 string 了，同样，对于 number、boolean 也是一样的缩减逻辑：

```ts
type URStr = "string" | string; // 类型是 string
type URNum = 2 | number; // 类型是 number
type URBoolen = true | boolean; // 类型是 boolean
enum EnumUR {
  ONE,
  TWO,
}
type URE = EnumUR.ONE | EnumUR; // 类型是 EnumUR
```

TypeScript 对这样的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”。可是这个缩减，却极大地削弱了 IDE 自动提示的能力，如下代码所示：

```ts
type BorderColor = "black" | "red" | "green" | "yellow" | "blue" | string; // 类型缩减成 string
```

因为类型被缩减成 string，所有的字符串字面量 black、red 等都无法自动提示出来了。

但是 TypeScript 官方其实还提供了一个黑魔法，它可以让类型缩减被控制。如下代码所示，我们只需要给父类型添加“& {}”即可

```ts
type BorderColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | (string & {}); // 字面类型都被保留
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

## 枚举类型

在 JavaScript 原生语言中并没有与枚举匹配的概念，而 TypeScript 中实现了枚举类型（Enums），这就意味着枚举也是 TypeScript 特有的语法。

在 TypeScript 中，我们可以使用枚举定义包含被命名的常量的集合，比如 TypeScript 支持数字、字符两种常量值的枚举类型。

```ts
enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}
```

Day 既可以表示集合，也可以表示集合的类型，所有成员（enum member）的类型都是 Day 的子类型。

### 数字枚举

仅仅指定常量命名的情况下，定义的就是一个默认从 0 开始递增的数字集合，称之为数字枚举。如果希望枚举值从其他值开始递增，则可以通过“常量命名 = 数值” 的格式显示指定枚举成员的初始值

```ts
enum Day {
  SUNDAY = 1,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}
```

上边的代码转译为 JavaScript 之后，则是一个属性值从 1 开始递增的对象，如下代码所示：

```js
var Day = void 0;
(function (MyDay) {
    Day[Day["SUNDAY"] = 1] = "SUNDAY";
    Day[Day["MONDAY"] = 2] = "MONDAY";
    ...
    Day[Day["SATURDAY"] = 7] = "SATURDAY";
})(Day || (Day = {}));
```

### 字符串枚举

```ts
enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  ...
}
```

上述代码转译为 JavaScript 后，Day.SUNDAY 的值依旧是 'SUNDAY'，Day.MONDAY 的值依旧是 'MONDAY'，如下代码所示：

```js
var Day = void 0;
(function (Day) {
  Day["SUNDAY"] = "SUNDAY";

  Day["MONDAY"] = "MONDAY";
})(Day || (Day = {}));
```

相比于没有明确意义的递增值的数字枚举，字符串枚举的成员在运行和调试阶段，更具备明确的含义和可读性，枚举成员的值就是我们显式指定的字符串字面量。

### 异构枚举

从技术上来讲，TypeScript 支持枚举类型**同时拥有**数字和字符类型的成员，这样的枚举被称之为异构枚举。

当然，异构枚举也被认为是很“鸡肋”的类型。比如如下示例中，我们定义了成员 SUNDAY 是 'SUNDAY'、MONDAY 是 2，我也不知道这样的枚举能在哪些有用的场合进行使用。

```ts
enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 2,
  ...
}
```

### 常量枚举

通过添加 const 修饰符定义常量枚举，常量枚举定义转译为 JavaScript 之后**会被移除**，并在使用常量枚举成员的地方被替换为相应的内联值，因此常量枚举的成员都必须是常量成员（字面量 + 转译阶段可计算值的表达式），如下代码所示：

```ts
const enum Day {
  SUNDAY,
  MONDAY,
}
const work = (d: Day) => {
  switch (d) {
    case Day.SUNDAY:
      return "take a rest";
    case Day.MONDAY:
      return "work hard";
  }
};
```

转译为成 JavaScript 后，Day 枚举的定义就被移除了，work 函数中对 Day 的引用也变成了常量值的引用，如下代码所示：

```js
var work = function (d) {
  switch (d) {
    case 0 /* SUNDAY */:
      return "take a rest";
    case 1 /* MONDAY */:
      return "work hard";
  }
};
```

常量枚举不仅能减少转译后的 JavaScript 代码量（因为抹除了枚举定义），还不需要到上级作用域里查找枚举定义（因为直接内联了枚举值字面量）。

### 外部枚举

在 TypeScript 中，我们可以通过 declare 描述一个在其他地方已经定义过的变量，如下代码所示：

```ts
declare let $: any;
$("#id").addClass("show"); // ok
```

第 1 行我们使用 declare 描述类型是 any 的外部变量 $，在第 2 行则立即使用 $ ，此时并不会提示一个找不到 $ 变量的错误。

同样，我们也可以使用 declare 描述一个在其他地方已经定义过的枚举类型，通过这种方式定义出来的枚举类型，被称之为外部枚举，如下代码所示：

```ts
declare enum Day {
  SUNDAY,
  MONDAY,
}

const work = (x: Day) => {
  if (x === Day.SUNDAY) {
    x; // 类型是 Day
  }
};
```

转译为 JavaScript 之后，外部枚举的定义也会像常量枚举一样被抹除，但是对枚举成员的引用会被保留

## 泛型

泛型指的是类型参数化，即将原来某种具体的类型进行参数化。和定义函数参数一样，我们可以给泛型定义若干个类型参数，并在调用时给泛型传入明确的类型参数。设计泛型的目的在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者接口成员和方法之间的关系。

### 泛型类型参数

泛型最常用的场景是用来约束函数参数的类型，我们可以给函数定义若干个被调用时才会传入明确类型的参数。

比如以下定义的一个 reflect 函数 ，它可以接收一个任意类型的参数，并原封不动地返回参数的值和类型

```ts
function reflect(param: unknown) {
  return param;
}
const str = reflect("string"); // str 类型是 unknown
const num = reflect(1); // num 类型 unknown
```

此时，reflect 函数虽然可以接收一个任意类型的参数并原封不动地返回参数的值，不过返回值类型不符合我们的预期。因为我们希望返回值类型与入参类型一一对应（比如 number 对 number、string 对 string），而不是无论入参是什么类型，返回值一律是 unknown。

此时，泛型正好可以满足这样的诉求，首先，我们把参数 param 的类型定义为一个（类型层面的）参数、变量，而不是一个明确的类型，等到函数调用时再传入明确的类型。

比如我们可以通过尖括号 <> 语法给函数定义一个泛型参数 P，并指定 param 参数的类型为 P ，如下代码所示：

```ts
function reflect<P>(param: P) {
  return param;
}
```

也可以使用泛型显式地注解返回值的类型，虽然没有这个必要（因为返回值的类型可以基于上下文推断出来）

```ts
function reflect<P>(param: P): P {
  return param;
}
```

然后在调用函数时，我们也通过 <> 语法指定了如下所示的 string、number 类型入参，相应地，reflectStr 的类型是 string，reflectNum 的类型是 number。

```ts
const reflectStr = reflect<string>("string"); // str 类型是 string
const reflectNum = reflect<number>(1); // num 类型 number
```

另外，如果调用泛型函数时受泛型约束的参数有传值，泛型参数的入参可以从参数的类型中进行推断，而无须再显式指定类型（可缺省），因此上边的示例可以简写

```ts
const reflectStr2 = reflect("string"); // str 类型是 string
const reflectNum2 = reflect(1); // num 类型 number
```

泛型不仅可以约束函数整个参数的类型，还可以约束参数属性、成员的类型，比如参数的类型可以是数组、对象，如下示例：

```ts
function reflectArray<P>(param: P[]) {
  return param;
}
const reflectArr = reflectArray([1, "1"]); // reflectArr 是 (string | number)[]
```
