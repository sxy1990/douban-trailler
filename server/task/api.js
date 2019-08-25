// 第二步.通过doubanId直接获取api中的数据,补充一些数据到数据库中
const rp = require('request-promise-native');


//定义一个通过doubanId获取豆瓣API的数据的函数
async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/${item.doubanId}`;

    const res = await rp(url);

    let body ;
    try{
        body = JSON.parse(res);
    } catch(error){
        console.log(error);
    }
    return body;
}


;(async () => {
    let movie = [
        
        { doubanId: 1292720,
            title: '阿甘正传',
            rate: 9.5,
            poster:
             'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2559011361.webp' 
        },
    ];

    movie.map(async (item) => {
        let res = await fetchMovie(item);
        console.log(res);
    })
})();