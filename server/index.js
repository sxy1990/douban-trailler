const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next) => {
    ctx.body =  ' hi luk';
})

app.listen(8080);