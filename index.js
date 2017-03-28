
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/usr1', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/usr2', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
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
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
