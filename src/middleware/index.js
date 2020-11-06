/*
 * @Descripttion: 
 * @Author: xxh
 * @Date: 2020-11-05 17:26:42
 * @LastEditors: xxh
 * @LastEditTime: 2020-11-06 11:00:22
 */
const path = require('path')
const ip = require('ip')
const miSend = require('./mi-send')
const miLog = require('./mi-log')
const miHttpError = require('./mi-http-error')
const cors = require("koa2-cors")
// 引入规则中件间
const miRule = require('./mi-rule')
module.exports = (app) => {
  // 设置跨域
  app.use(
    cors({
      origin: function (ctx) {
        // if (ctx.url === '/test') {
        //     return "*"; // 允许来自所有域名请求
        // }
        return 'http://localhost:3000' // 只允许该域名的请求通过了
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 5,
      credentials: true,
      allowMethods: ["GET", "POST", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization", "Accept"],
    })
  )
  /**
   * 在接口的开头调用
   * 指定 controller 文件夹下的 js 文件，挂载在 app.controller 属性
   * 指定 service 文件夹下的 js 文件，挂载在 app.service 属性
   */ 
  miRule({
    app,
    rules: [
      {
        folder: path.join(__dirname, '../controller'),
        name: 'controller'
      },
      {
        folder: path.join(__dirname, '../service'),
        name: 'service'
      }
    ]
  })

  // 应用请求错误中间件
  app.use(miHttpError({
    errorPageFolder: path.resolve(__dirname, '../errorPage')
  }))
  
	// 将配置中间件的参数在注册中间件时作为参数传入
  app.use(miLog({
    env: app.env,  // koa 提供的环境变量
    projectName: 'xixi_customize_server',
    appLogLevel: 'debug',
    dir: 'logs',
    serverIp: ip.address()
	}))
	
	// 注册中间件
  app.use(miSend())

  // 增加错误的监听处理
  app.on("error", (err, ctx) => {
    if (ctx && !ctx.headerSent && ctx.status < 500) {
      ctx.status = 500
    }
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
  })
}