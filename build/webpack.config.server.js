const path = require('path');
const config = {
    target: 'node',
    entry:{
        app: path.join(__dirname,'../client/server-entry.js')//用作服务器端渲染的入口文件
    },
    output:{
        filename: 'server-entry.js',//打包后的文件名称
        path: path.join(__dirname,'../dist'),//打包后的文件所在位置
        publicPath: '/public',//配置静态资源的前缀，方便服务器对于静态资源的判断
        libraryTarget:'commonjs2'//服务器端的模块规范用commonjs2
    },
    module:{
        rules:[
            {
                test: /.jsx$/,
                loader: 'babel-loader'//使用babel-loader去编译jsx文件
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [
                    path.join(__dirname,'../node_modules')
                ]
            }
        ]
    },
}

module.exports = config;