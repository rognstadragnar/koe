import React, { Component } from 'react'
import { Link } from 'react-router'

export default () => {
	return (
		<nav>
			<Link to='/koe'>Koe</Link>
			<Link to='/'>not</Link>
		</nav>
	)
}