/*
 * @Descripttion: 
 * @Author: xxh
 * @Date: 2020-11-05 17:26:42
 * @LastEditors: xxh
 * @LastEditTime: 2020-11-05 18:13:05
 */
const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
// 引入 koa-static
const staticFiles = require('koa-static')

const app = new Koa()
const router = require('./router/router')

// =====中间件引用=======
const middleware = require('./middleware')
middleware(app)

// 指定 public目录为静态资源目录，用来存放 js css images 等
app.use(staticFiles(path.resolve(__dirname, "./public")))

// 视图层
app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),// 指定视图目录
  nunjucksConfig: {
    trimBlocks: true // 开启转义 防Xss
  }
}));

// 对http请求体进行解析
app.use(bodyParser())

// 引入路由
router(app)

app.listen(5000, () => {
  console.log('server is running at http://localhost:5000')
})