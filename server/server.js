const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const express = require('express');
const reactSSR = require('react-dom/server');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const isDev = process.env.NODE_ENV === 'development' ? true : false;

app.use(favicon(path.join(__dirname,'../favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	maxAge: 10 * 60 * 1000,
	name: 'userid',
	secret: 'react cnode',
	resave: false,
	saveUninitialized: false
}))

app.use('/api/user',require('./api/login'));
app.use('/api',require('./api/proxy'));

if(!isDev){
    app.use('/public',express.static(path.join(__dirname,'../dist')));
    app.get('*',function (req,res) {
        const serverEntry = require('../dist/server-entry').default;
        const appString = reactSSR.renderToString(serverEntry);//把服务器端渲染的入口文件转成HTML模板
        const indexHtml = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf-8');
        res.send(indexHtml.replace('<!--app-->',appString));
    })
}else{
    const devStatic = require('./util/dev-static');
    devStatic(app);
}

app.listen(3333,function () {
    console.log('3333 port startup');
})
