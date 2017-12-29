/**
 在开发阶段，进行服务器端渲染，只需要关注两个点：
 1.获取浏览器端webpack-dev-Server在内存生成的index.html
 2.当浏览器端的文件发生变更，要实时获取服务器端的bundle文件，也就是server-entry文件
 */
const axios = require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');//和fs模块的API一致，只不过是写入内存而已
const proxy = require('http-proxy-middleware');
const reactSSR = require('react-dom/server');
const serverConfig = require('../../build/webpack.config.server');
const mfs = new MemoryFileSystem();

//获取webpack-dev-Server在内存生成的index.html
function getTemplate() {
	return new Promise((resolve,reject) => {
		axios.get('http://localhost:8888/public/index.html')
			.then(res => {
				resolve(res.data);
			})
			.catch(reject);
	});
}

let serverBundle;
const webpackCompiler = webpack(serverConfig);//根据服务器端的webpack配置文件启动webpack编译器，进行构建编译打包
webpackCompiler.outputFileSystem = mfs;//webpack编译的文件输出到内存当中，不写入硬盘，以此提高读写速度
//webpack编译器监听配置文件的变化，重新构建编译打包，反映到服务器中
webpackCompiler.watch({},(err,stats) => {
	if(err) throw err;
	stats = stats.toJson();//stats是启动webpack时候命令行输出的那堆信息
	stats.errors.forEach(err => console.log(err));//命令输出启动错误信息
	stats.warnings.forEach(warn => console.log(warn));//命令行输出警告信息

	const serverBundlePath = path.join(serverConfig.output.path,serverConfig.output.filename);//获取服务器端的bundle文件路径
	console.log(serverBundlePath);
	const serverBundleString = mfs.readFileSync(serverBundlePath,'utf-8');//以字符串的形式获取服务器端bundle文件
	const m = new module.constructor();//获取commonjs模块的构造函数
	m._compile(serverBundleString,'server-entry.js');//利用commonjs的模块构造函数把字符串形式的js转成commonjs规范的js文件，并设置名称供其它模块可以require
	serverBundle = m.exports.default;//获取commonjs规范的serverBundle文件
})

module.exports = (app) => {
	//把在内存中对静态资源的请求都代理到浏览器端devServer的地址
	app.use('/public',proxy({
		target: 'http://localhost:8888'
	}));
	app.get('*',(req,res) => {
		getTemplate().then(template => {
			let appString = reactSSR.renderToString(serverBundle);
			res.send(template.replace('<!--app-->',appString));
		}).catch(err => {
			throw err
		});
	})
}
