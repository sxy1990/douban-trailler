const { readFile,readFileSync} = require('fs')
setImmediate(() => console.log('[阶段3.immediate] immediate回调1'))
setImmediate(() => console.log('[阶段3.immediate] immediate回调2'))
setImmediate(() => console.log('[阶段3.immediate] immediate回调3'))

Promise.resolve().then(() => {
    console.log('[...待切入下一阶段] promise 回调1');
    setImmediate(() => console.log('[阶段3.immediate] promise 回调1 增加的immediate回调4'))
})

readFile('../package.json','utf-8',data => {
    console.log('[阶段2..Io回调] 读文件回调1')
    readFile('../README.md','utf-8',data => {
        console.log('[阶段2..Io回调] 读文件回调2')
        setImmediate(() => console.log('[阶段3.immediate] 读文件回调2 增加的immediate回调4'))
    })
    setImmediate(() => {
        console.log('[阶段3.immediate] immediate回调4')
        Promise.resolve().then(() => {
            console.log('[...待切入下一阶段] promise 回调2');
            process.nextTick(() => {
                console.log('[...待切入下一阶段] promise回调2 增加的 nextTick 回调5')
            })
        }).then(() => {
            console.log('[...待切入下一阶段] promise 回调3');
        })   
    })

})

setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调1');
}, 0);
setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调5');
    process.nextTick(() => {
        console.log('[...待切入下一阶段] nextTick 回调2')
    })
}, 0);
setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调3');
}, 0);
setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调4');
}, 0);

process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调1')
})
process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调2')
    process.nextTick(() => {
        console.log('[...待切入下一阶段] nextTick 回调4')
    })
})
process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调3')
})
