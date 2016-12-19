import React, { Component } from 'react'
import { render as Render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, Link, browserHistory } from 'react-router'
import page1 from './components/page1/'
import notFound from './components/notFound/'
import MainLayout from './components/_layouts/main.jsx'


const root = document.getElementById('root');

Render((
	<Router history={browserHistory}>
    <Route path='/' component={MainLayout} >
			<IndexRoute />
			<Route path="koe" component={page1}/>
			<Route path="*" component={notFound}/>
    </Route>
  </Router>
), root)