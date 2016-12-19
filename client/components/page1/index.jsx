import React, { Component } from 'react'
import socket from 'socket.io-client'
import axios from 'axios'

class page extends Component {
	constructor() {
		super()
		this.state = {
			io: new socket('http://localhost:3001'),
			position: ''
		}
		this.handleClick = this.handleClick.bind(this)
	}
	componentWillMount() {
		axios.post('/api/enter', { koe: 123 })
			.then(res => this.state.io.connect())
			.catch(err => console.log(err))


		this.state.io.on('update', data => {
			console.log('asd', data)
			this.setState(data)

			let position;
			if (this.state.serving && this.state.myId == this.state.serving.uid) {
				this.setState({
					position: 'Din tur'
				})
			} else if (
				this.state.inLine.length &&
				this.state.myId &&
				this.state.inLine.map(
					i => i.uid).indexOf(this.state.myId) >= 0)  {
				this.setState({
					position: this.state.inLine.map(
						i => i.uid).indexOf(this.state.myId)
				})
			} else {
				this.setState({
					position: 'Du står ikke i kø'
				})
			}

		})
		this.state.io.on('uid', data => {
			this.setState({
				myId: data.data
			})
		})
	}
	componentWillUnmount() {
		this.state.io.disconnect()
	}
	handleClick() {
		console.log('asd')
		this.state.io.emit('serveNext', { 'lol': 'll' })
	}
	render() {

		return (
			<div>
				<p>Posisjon i koe: {this.state.position}</p>
				<button onClick={this.handleClick}>next</button>
			</div>
		)
	}
}
export default page