const puppeteer = require('puppeteer');

const base = 'https://movie.douban.com/subject/';
const doubanId = `27163278`;
const videoBase = `https://movie.douban.com/trailer/249246`;

//定义一个定时函数，休眠一个time后再执行
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})
//一个自动执行的异步函数，来自动获取豆瓣电影上的相关信息
//这里的内容是豆瓣主页，电影分类的页面
;(async () => {
    console.log('start visit the target page');

    //定义一个模拟的chromium浏览器browser，在这上面进行操作
    const browser = await puppeteer.launch({
        args:['--no-sandbox'],
        dumpio:false
    });

    //打开一个新的网页，载入目标网页
    const page = await browser.newPage();
    await page.goto(base + doubanId,{
        waitUntil:'networkidle2'
    })

    //等待网页载入3秒钟
    await sleep(1000);

     //这是个分页的，有个选择更多，F12查看源网页内容，这是一个a标签，其id是.more
    //await page.waitForSelector('.more');

    //爬取多少页的内容
    // for(let i = 0; i < 1;i++){
    //     await sleep(3000);
    //     await page.click('.more');
    // }

    //获取网页内容放入数组对象中,页面中有已加载好的JQuery库，所以可以直接用jQuery
    const result = await page.evaluate(() => {
        var $ = window.$;
        var it = $('.related-pic-video');
        if( it && it.length > 0) {
            var link = it.attr('href');
            var cover = it.css('backgroundImage').split("(")[1].split(")")[0].replace(/\"/g,"");
            return {
                link,
                cover
            }
        }
       
        return {};
    });
    let video;
    if(result.link) {
        await page.goto(result.link,{
            waitUntil:'networkidle2'
        })
        await sleep(2000)
        video = await page.evaluate(() => {
            var $ = window.$;
            var it = $('source');
            if(it &&it.length>0) {
                return it.attr('src')
            }
            return '';
        })
    }

    const data = {
        video,
        doubanId,
        cover:result.cover
    }
   //关闭这个模拟的browser
    browser.close();

     //将这个结果发送出去
     process.send({data});
     process.exit(0);
})()