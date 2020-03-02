初始化配置

```
npm -init -y
npm i -D typescript @types/node @types/express
npx tsconfig.json
```

监控 ts 修改 自动编译自动运行的两种途径

1. ts-node-dev
   安装：`npm i -D ts-node-dev`
   使用：`ts-node-dev --respawn src/index.ts`

2. nodemon
   安装：`npm i -D nodemon ts-node`
   使用：`nodemon --exec ts-node src/index.ts`

保证版本最新: `yarn upgrade-interactive` 或者 `ncu`
