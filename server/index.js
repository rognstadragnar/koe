import express from 'express'
import http from 'http'
import cors from 'cors'
import BodyParser from 'body-parser'
import Session from 'express-session'
import socketSession from 'socket.io-session-middleware'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || '3001'

app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

app.use(cors({
	origin: 'http://localhost:3001',
	credentials: true
}))


import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config.dev.js'

const webpackCompiler = webpack(webpackConfig)
app.use(webpackMiddleware(webpackCompiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));

app.use(webpackHotMiddleware(webpackCompiler))
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

const session = Session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
})
app.use(session)


app.use((req, res, next) => {
  if (req.path.length > 1 && /\/$/.test(req.path)) {
    const query = req.url.slice(req.path.length)
    res.redirect(301, req.path.slice(0, -1) + query)
  } else {
    next()
  }
})

app.use(routes);

const server = new http.createServer(app);
const io = require('socket.io').listen(server)
io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});
let people = []
let inLine = [{uid: 123123, time: new Date().getTime() + 12}]
let serving = {}
let alreadyServed = []
io.on('connection', socket => {
	io.to(socket.id).emit('uid', {data: socket.handshake.session.user});

	io.sockets.sockets[socket.handshake.session] = socket.handshake.session
	if (
		socket.handshake.session && 
		socket.handshake.session.user
	) {
		if (people.map(p => p.uid).indexOf(socket.handshake.session.user) < 0) {
			people.push({uid: socket.handshake.session.user, time: new Date().getTime()})
			inLine.push({uid: socket.handshake.session.user, time: new Date().getTime()})
		}
	} 
	if (inLine.length > 1) {
		inLine.sort((a, b) => {
			if (a.time > b.time) return 1
			if (a.time < b.time) return -1
			return 0
		})
	}
	io.to(socket.id).emit('update', {inLine: inLine, serving: serving, alreadyServed: alreadyServed})


	socket.on('disconnect', () => {
		const peoplePos = people.map(p => p.uid).indexOf(socket.handshake.session.user)
		if (peoplePos >= 0) people.splice(peoplePos, 1)
		alreadyServed.map((p, i) => p.uid === socket.handshake.session.user ? inLine.splice(i, 1) : null)
  })

	socket.on('serveNext', () => {
		if (inLine.length) {
			
			if (Object.keys(serving).length !== 0) {
				alreadyServed.push(serving)
			}
			if (inLine.length > 1) {
				inLine.sort((a, b) => {
					if (a.time > b.time) return 1
					if (a.time < b.time) return -1
					return 0
				})
				inLine.shift()
				serving = inLine[0]
			}	else {
				serving = inLine[0]
				inLine.shift()
			}
		} else if (Object.keys(serving).length !== 0 && !inLine.length){	
			alreadyServed.push(serving)
			serving = {}
		}
		io.sockets.emit('update', {inLine: inLine, serving: serving, alreadyServed: alreadyServed})
	})
})




server.listen(PORT, () => console.log('running on port: ' + PORT))