import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TopicList from "../views/topic-list/top-list";
import TopicDetail from "../views/topic-detail/top-detail";
import TestApi from '../views/test/test';

export default () => [
	<Route path="/" key="index" render={() => <Redirect to="/list" />} exact />,
	<Route path="/list" key="list" component={TopicList} />,
	<Route path="/detail" key="detail" component={TopicDetail} />,
	<Route path="/test" key="test" component={TestApi} />,
];
