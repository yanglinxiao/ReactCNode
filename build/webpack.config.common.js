const path = require('path');

module.exports = {
	resolve: {
		extensions: ['.js','.jsx']//配置默认后缀名
	},
	module:{
		rules:[
			{
				enforce: 'pre',//在所有loader之前执行
				test: /.(js|jsx)$/,
				loader: 'eslint-loader',
				exclude: [
					path.resolve(__dirname,'node_modules/')
				]
			},
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
