const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';//判断是否处于开发环境
const config = {
    entry:{
        app: path.join(__dirname,'../client/app.js')//配置项目入口文件
    },
    output:{
        filename: '[name].[hash].js',//打包后的文件名称
        path: path.join(__dirname,'../dist'),//打包后的文件所在位置
        publicPath: '/public/'//配置静态资源的前缀，方便服务器对于静态资源的判断
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

//devServer是存在于内存当中的服务器，但是硬盘上存在dist目录会访问硬盘上的，所以启动devServer要先删除硬盘上的dist目录
if(isDev){
    config.entry = {
        app: [
            'react-hot-loader/patch',
            path.join(__dirname,'../client/app.js')
        ]
    }
    config.devServer = {
        host: '0.0.0.0',//这样配置能让局域网都能访问，如果配置localhost或者127.0.0.1只能是本机访问
        port: '8888',
        contentBase: path.join(__dirname,'../dist'),//设置启动webpack服务器的文件夹
        hot: true,//启用热更替
        overlay: {
            errors: true
        },//webpack服务器出现错误能够以层叠（弹窗）提醒
        publicPath: '/public',//配置静态资源路径前缀和output中的一致，否则无法访问
        historyApiFallback:{
            index: '/public/index.html'//找不到页面的时候跳转到index.html
        },
        // headers: {
        //     'Access-Control-Allow-Origin': '*',
        // }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin());//实现热更替的webpack插件
}

module.exports = config;