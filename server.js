const express = require('express');
const app = express();
const http = require('http').Server(app);
const passport = require('passport');
const session = require('express-session');
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const mariaStore = require('express-mysql-session')(session);
var sessionStore = new mariaStore({host: 'localhost', port: 3306, user: 'benjamin', password: '@Dank.2', database: 'monitor'})


app.use('/app', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/app/assets'));

http.listen(8000, ()=>{
  console.log('Server running on port 8000');
});

const pass = require('./api/config/pass');

app.use(session({
  store: sessionStore,
  secret: 'bushdid911',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 5*60*1000, secure: false } // 5 min
}))

io.use(passportSocketIo.authorize({
  store: sessionStore,
  key: 'express.sid',
  secret: 'bushdid911',
  passport: passport,
  cookieParser: cookieParser
}))

app.use(passport.initialize())
app.use(passport.session())

//Socket connection
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('heartbeat', function(bpm){
    if (socket.request.user && socket.request.user.logged_in) {
      io.emit('heartbeat', bpm);
    }
  });
  socket.on('disconnect', function() {
    console.log(socket.request.user.username + ' disconnected');
  })
});

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html')
});

const router = require('./api/config/router')(app);
