'use strict';
var express = require('express'),
	app = express(),
	colors = require('colors'),
	path = require('path'),
	cookieParse = require('cookie-parser'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

	var userCount = 0;
	var users = new Set();
	app.use(express.static('public'));
	app.use(cookieParse());

	app.get('/', (req, res, next) => {
		res.header("Content-Type", "text/html;charset=utf-8");
		const fpath = path.join(__dirname, 'public', 'page', 'index.html');
		res.sendFile(fpath);
	});

	app.get('/index.html', (req, res) => {
		const fpath = path.join(__dirname, 'public', 'page', 'index.html');
		res.sendFile(fpath);
	});

	const assert = (msg) => ( process.stdout.write('\r\n'+String(msg)) );

	io.on('connection', (socket) => {
		assert('A user connected');
		socket.on('add user', (name) => {
			userCount++;
			users.add(name);
			assert(String(name).yellow+' 加入聊天室...');
			var list = Array.from.call(null, users);
			socket.emit('login', {name:name, users:JSON.stringify(list)});
			socket.broadcast.emit('user joined', {name:name, users:JSON.stringify(list)});
		});
		socket.on('new message', (msgObj) => {
			socket.emit('message', msgObj);
			socket.broadcast.emit('message', msgObj);
		});
	});

	const Server = http.listen(8080, '0.0.0.0', () => {
		const address = Server.address().address;
		const port = Server.address().port;
		process.stdout.write('SERVER START! ADDRESS: '+String(address).red+' PORT: '+String(port).red);
	});