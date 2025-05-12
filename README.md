# filio-svelte

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://www.ayushsingh.co.in)

The origin program is [here](https://github.com/ayush013/folio.git), which is powered by React and presents a wonderful UI/UX. 

This project is its SvelteKit version.
All of there are almost the best practices.
>初始的项目在这里, 是用React驱动的. 本项目是其SvelteKit版本

if it helps you, you can star me.
> 如果对你有帮助送我一颗珍贵的小星星（づ￣ 3 ￣）づ ╭❤ 

## How to run on local?  如何运行?

First, run the development server: 
>首先安装该安装的package
```bash
npm install
# or
yarn
```
Second, run the development server: 
>第二步, 运行

```bash
npm run dev
# or
yarn dev
```

## How to reconstruct?  如何重构?
|React | Vue| svelte
|:-:|-|-|
|useRef | ref| let(variables)/bind:this(components)|
|useEffect | onMounted/onUnmounted| onMount/onDestroy|
| {} | v-bind| {} |
| jsx parameter| defineProps | export |
|MutableRefObject|Ref<HeepElement>| HTTPElement|

## 对比 
| Vue | svelte|
| -|--|
|运行时框架 | 编译时框架|
|Virtual DOM | 静态模板|
|class variable | 无class variable|
| ?? | 官方调试工具|
| nuxt | sveltekit|