//Stating all the dependencies of the application, mainly middlewares
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
//End of dependencies, we define the resources folders that the front end will request for frameworks and other stuff
app.use('/app', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/app/assets'));

http.listen(8000, ()=>{       //We run the server
  console.log('Server running on port 8000');
});

const pass = require('./api/config/pass'); //Config por PassportJS, contains the definition of local strategy on authentication process

app.use(session({       //Defining passportJS session that will be used to verify the user everytime he request data
  store: sessionStore,
  secret: 'bushdid911',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10*60*1000, secure: false } // 10 min
}))

io.use(passportSocketIo.authorize({ //Sharing the PassportJS session to SocketIO so the sockets will be authenticated
  store: sessionStore,
  key: 'connect.sid',
  secret: 'bushdid911',
  passport: passport,
  cookieParser: cookieParser
}))

app.use(passport.initialize()) //Initializing passport with the neccesary config
app.use(passport.session())

//Socket connection
io.on('connection', (socket)=>{  //Conecta por medio de socket al usuario

  socket.on('patient', (patient)=>{   //Subscribe al usuario a la emision de datos del paciente
    if (socket.request.user && socket.request.user.logged_in) {
      socket.join(patient)
      console.log(socket.request.user.username+' joined the room '+patient);
   }
  })

  socket.on('left', (toLeave)=>{ //Dejando el paciente
    console.log(socket.request.user.username+' left the room '+toLeave);
    socket.leave(toLeave);
  })


    socket.on('dashboard', (patientlist)=>{

    })
})


//Serving the index
app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html')
});

//Routing arduino data to sockets
app.get('/arduino/:id', (req, res)=>{
  res.send('thanks for submitting')
  const room = 'stream:'+req.params.id
  var randint = Math.floor(Math.random() * (70 - 50 + 1)) + 50
  var randst = Math.floor(Math.random() * (2 + 1))
  var states = ['Caminando', 'Estable', 'Caida']
  info = {bpm: randint, state: states[randst]}
  io.to(room).emit('bpm', info) //Al recibir los datos del arduino por post request los emite en el sitio del paciente*/
})


const router = require('./api/config/router')(app);
