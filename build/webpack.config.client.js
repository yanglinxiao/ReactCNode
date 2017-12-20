const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = {
    entry:{
        app: path.join(__dirname,'../client/app.js')//配置项目入口文件
    },
    output:{
        filename: '[name].[hash].js',//打包后的文件名称
        path: path.join(__dirname,'../dist'),//打包后的文件所在位置
        publicPath: '/public'//配置静态资源的前缀，方便服务器对于静态资源的判断
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
    plugins:[
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'../client/template.html')
        })
    ]
}

module.exports = config;