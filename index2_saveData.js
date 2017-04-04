//ejs
//postman
var app = require('express')();
var http = require('http').Server(app);
var clients = [];
var io = require('socket.io')(http);
var url = require('url');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/usr1', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// app.get('/index.html', function(req, res){
//   console.log('');
//   res.sendFile(__dirname + '/index.html');
// });



// var nsp = io.of('/my-namespace');
// nsp.on('connection', function(socket){
//   console.log('someone connected');
// });
// nsp.emit('hi', 'everyone!');
//
// io.on('connection', function(socket){
//   socket.join('some room');
// });
//
// io.to('some room').emit('some event');
//
// io.on('connection', function(socket){
//   socket.on('say to someone', function(id, msg){
//     socket.broadcast.to(id).emit('my message', msg);
//   });
// });



io.on('connection', function(socket){
  console.log('a user connected');
  clients[socket.id] = socket;
  console.log(socket.handshake.headers.referer.split('/')[3]);
  //socket.emit
  //This socket.on event is after the socket.emit event of the browser
  socket.on('chat messages', function(msg){
    socket.emit('chat message', 'me: ' + msg);//message received by the user
    /**
    *This socket.emit is the socket.on event received by the user on the client side
    */
    socket.broadcast.emit('chat message', msg);//To emit messages to only other persons of the group
    //socket.broadcast.emit('hi');
  });
  // socket.on('say to someone', function(id, msg){
  //   socket.broadcast.to(id).emit('my message', msg);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
