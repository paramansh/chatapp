
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
  socket.on('chat messages', function(msg){
    socket.broadcast.emit('chat messages', msg);//To emit messages to only other persons of the group
    
    //socket.broadcast.emit('hi');

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
