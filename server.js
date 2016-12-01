//Stating all the dependencies of the application, mainly middlewares
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const http = require('http').Server(app);
const passport = require('passport');
const session = require('express-session');
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const mariaStore = require('express-mysql-session')(session);
var sessionStore = new mariaStore({host: 'localhost', port: 3306, user: 'benjamin', password: '@Dank.2', database: 'monitor'})  //Cambialo a tus datos de conexion, debes de crear la base primero
//Twilio configuration to send sms
var twilio = require('twilio')('ACf44670cb2fbae6d5bc2b1a71fcc96cf4', 'dd5b6700e26166fb8f85d1438cf1b2fa');

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
  saveUninitialized: false,
  cookie: { maxAge: 60*60*1000, secure: false } // 60 min
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

})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Serving the index
app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html')
});

//Routing arduino data to sockets
app.post('/arduino/', (req, res)=>{

  const room = 'stream:1'//el id que mandes con el arduino, que sera el mismo deviceid del paciente que crees en la base de datos
  info = {bpm: req.body.BPM, state: req.body.ESTADO}  //En este debes poner el bpm que viene en la request
  /*console.log(req.body.BPM);
  console.log(req.body.ESTADO);*/
  console.log(info);

  if(info.state==='¡Alerta!'){
    console.log("About to send sms");
    twilio.sendMessage({
        to:'+50363004746',
        from: '+15713897109',
        body: 'He sufrido una caida y necesito ayuda'
    }, function(err, responseData) {
        if (!err) {
            console.log(responseData.from);
            console.log(responseData.body);
        }
    });
  }

  io.to(room).emit('bpm', info)           //Al recibir los datos del arduino por post request los emite en el sitio del paciente*/
})


const router = require('./api/config/router')(app);
