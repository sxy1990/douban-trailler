

const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config');

const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK,config.qiniu.SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac,cfg);

const uploadToQiniu = async (url,key) => {
    return new Promise((resolve,reject) => {
        client.fetch(url,bucket,key,(err,ret,info) => {
            if(err){
                reject(err)
            }else{
                if(info.statusCode === 200) {
                    resolve({key})
                }else{
                    reject(info)
                }
            }
        })
    })
}
//需要填写你的 Access Key 和 Secret Key
// qiniu.conf.ACCESS_KEY = config.qiniu.AK;
// qiniu.conf.SECRET_KEY = config.qiniu.SK;
// //构建上传策略函数
// function uptoken(bucket, key) {
//     var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
//     return putPolicy.token();
// }
// //构造上传函数
// function uploadFile(uptoken, key, localFile) {
//     var extra = new qiniu.io.PutExtra();
//       qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
//         if(!err) {
//           // 上传成功， 处理返回值
//           console.log(ret.hash, ret.key, ret.persistentId);   
//           return ret.key;    
//         } else {
//           // 上传失败， 处理返回代码
//           console.log(err);
//         }
//     });
//   }
//   //生成上传 Token

// //要上传文件的本地路径
// //filePath = './ruby-logo.png'
// //调用uploadFile上传
// let movies = [{ 
//     video:'http://vt1.doubanio.com/201908301539/e6a2f2a76c1361ad040fb30ea9432b11/view/movie/M/301080756.mp4',
//     doubanId: '1292052',
//     poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p480747492.webp',
//     cover:'https://img3.doubanio.com/img/trailer/medium/1433841022.jpg?' 
// }];
// movies.map(movie => {
//     if(movie.video && !movie.key) {
//         let movieKey = nanoid() + '.mp4'
       
//         let token1 = uptoken(bucket, movieKey);
//         console.log(movieKey);
//         return;
//         let posterKey = nanoid() + '.webp'
//         let token2 = uptoken(bucket, posterKey);
//         let coverKey = nanoid() + '.jpg'
//         let token3 = uptoken(bucket, coverKey);
//         let movieretkey = uploadFile(token1,movieKey, movie.video);
//         let posterretkey = uploadFile(token2,posterKey, movie.poster);
//         let coverretkey = uploadFile(token3,coverKey, movie.cover);

//         if(movieretkey){
//             movie.movieKey = movieretkey;
//         }
//         if(posterretkey){
//             movie.posterKey = posterretkey;
//         }
//         if(coverretkey){
//             movie.coverKey = coverretkey;
//         }
//         console.log(movie)
//     }
// })

;(async () => {
    let movies = [{ 
        video:'http://vt1.doubanio.com/201908301539/e6a2f2a76c1361ad040fb30ea9432b11/view/movie/M/301080756.mp4',
        doubanId: '1292052',
        poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p480747492.webp',
        cover:'https://img3.doubanio.com/img/trailer/medium/1433841022.jpg?' 
      }];
    movies.map(async movie => {
        if(movie.video && !movie.key) {
            try {
                console.log('开始传video');
                let videoData = await uploadToQiniu(movie.video,nanoid() + '.mp4')
                console.log('开始传cover');
                let coverData = await uploadToQiniu(movie.cover,nanoid() + '.jpg')
                console.log('开始传poster');
                let posterData = await uploadToQiniu(movie.poster,nanoid() + '.webp')

                if(videoData.key) {
                    movie.videoKey = videoData.key
                }
                if(coverData.key) {
                    movie.coverKey = coverData.key
                }
                if(posterData.key) {
                    movie.posterKey = posterData.key
                }
                console.log(movie)
            }catch(err){
                console.log(err)
            }
        }
    })
})()