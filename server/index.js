const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const { resolve } = require('path');
const { connect,initSchemas } = require('./database/init')
const mongoose = require('mongoose')
;(async () => {
    await connect()
    initSchemas()

    require('./task/movie')
})()

app.use(views(resolve(__dirname,'./views'),{ 
    extension: 'pug' 
}))

app.use(async (ctx,next) => {
    await ctx.render('index',{
        you:'Luke',
        me:'sxy'
    })
})

app.listen(8080);