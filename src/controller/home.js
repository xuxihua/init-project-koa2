/*
 * @Descripttion: 
 * @Author: xxh
 * @Date: 2020-11-05 17:26:42
 * @LastEditors: xxh
 * @LastEditTime: 2020-11-05 18:17:48
 */
module.exports = {
  index: async(ctx, next) => {
    await ctx.render("home/index", {title: "koa2服务启动"})
  },
  home: async(ctx, next) => {
    ctx.response.body = {
      code: 1,
      data: {
        message: '测试成功'
      },
      msg: null
    }
  },
  homeParams: async(ctx, next) => {
    ctx.response.body = '<h1>HOME page /:id/:name</h1>'
  },
  login: async(ctx, next) => {
    await ctx.render('home/login')
  },
  register: async(ctx, next) => {
    // 解构出 app 实例对象
    const { app } = ctx

    let params = ctx.request.body
    let name = params.name
    let password = params.password

    // 留意 service 层的调用方式
    let res = await app.service.home.register(name,password)
    if(res.status == "-1"){
      await ctx.render("home/login", res.data)
    }else{
      ctx.state.title = "个人中心"
      await ctx.render("home/success", res.data)
    }
  }
}