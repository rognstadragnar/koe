import React, { Component } from 'react'
import { Link } from 'react-router'
import Navbar from '../_common/Navbar'


export default ({children}) => {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	)
}