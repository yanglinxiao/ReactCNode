import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';//eslint-disable-line
import App from './views/App';

const root = document.getElementById('root');

const render = (Component) => {
	ReactDOM.render(
		<AppContainer>
			<BrowserRouter>
				<Component />
			</BrowserRouter>
		</AppContainer>,
		root,
	);
};

render(App);

//应用了react-hot-loader/babel，会把热加载的接口暴露在module.hot上
if(module.hot){
	//接受App.jsx进行热加载
	module.hot.accept('./views/App', () => {
		const NextApp = require('./views/App').default;//eslint-disable-line
		render(NextApp);
	});
}
