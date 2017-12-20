const fs = require('fs');
const path = require('path');
const express = require('express');
const reactSSR = require('react-dom/server');
const serverEntry = require('../dist/server-entry').default;
const app = express();

app.use('/public',express.static(path.join(__dirname,'../dist')));

app.get('*',function (req,res) {
    const appString = reactSSR.renderToString(serverEntry);//把服务器端渲染的入口文件转成HTML模板
    const indexHtml = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf-8');
    res.send(indexHtml.replace('<!--app-->',appString));
})

app.listen(3333,function () {
    console.log('3333 port startup');
})