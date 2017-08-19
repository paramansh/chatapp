var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/abc';//data saved in abc

var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({secret:"It's a secret session"}));


var database;
var mongoose = require('mongoose');
mongoose.connect(url);

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
  console.log('conneccted successfully to server');
  var database = db;
  http.listen(3000,console.log('listening'));
})

var userSchema = mongoose.Schema({
  name: String,
  password: String,
  date: Date
});
var user = mongoose.model('user', userSchema);

var messageSchema = mongoose.Schema({
  content: String,
  user: String,
  sentOn: Date,
});
var message = mongoose.model('message', messageSchema);

app.get('/', function(req, res){
  console.log(req.session)
  if(req.session.isLogged)
  {
  	res.redirect('/users/'+req.session.userName); 
    // res.sendFile(__dirname + '/index.html')
    /*user.findOne({name:req.session.userName},function(err,result){
        if(err) console.log(err);
        if(!result){//no need.....
          res.render('welcome.ejs',{content:''});
        }
        else{
          message.find({},function(err,messageResults){
            res.render('index.ejs',{content: "hello",
              messages:messageResults.filter(function(message){
              return message.sentOn>result.date;
            })})
          })
        }
      })*/
    // res.render('index.ejs', {content: "", messages: {}});
  }
  else{
    res.redirect('/login')
  }
})

app.get('/login', function(req, res){
  // console.log(req.session);//req.session is same for all requests from a user
  // res.sendFile(__dirname + '/welcome.html')
  res.render('welcome.ejs',{content:'heyy'})

  });

  app.get('/logout', function(req,res){
    req.session.isLogged = false;
    res.redirect('/login');
  })

app.post('/putUsername',function(req,res){
  user.findOne({name:req.body.name},function(err,result){
    if(err) console.log(err);
    if(result){
    res.render('welcome.ejs',{content:'user already exists'})
    }
    else{
      var user1 = new user({name:req.body.name, password:req.body.password,
      date:Date.now()})
      console.log(user1.name);
      console.log('request for new user received');
      user1.save(function(err,user1){
        if(err) return console.log(err);
        console.log('saved to database');
        // handleGetRequest(user1);
        res.redirect('/');
      })
    }
  })
})
app.post('/login',function(req,res){
  console.log('checking....');
  user.findOne({name:req.body.name, password:req.body.password},function(err,result){
  if(err) console.log(err);
  if(!result){
    console.log('not found');
    res.render('welcome.ejs',{content:'signup first / wrong password'})
  }
  else {console.log(result);
    req.session.isLogged = true;
    req.session.userName = req.body.name;
    req.session.cookie.userName = req.body.name;
    console.log(req.session);
  // res.redirect('/users/'+req.body.name);
    res.redirect('/users/'+req.body.name)
  }
})
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat messages', function(msg){
  	console.log(socket.handshake.headers.referer)
    //console.log(socket.handshake.headers);
    var messagee = new message({content: msg,
    user:socket.handshake.headers.referer.split('/')[4],
  sentOn:Date.now()})
  messagee.save(function(err,messagee){
    if(err) console.log(err);
    console.log(messagee);
  })
    socket.emit('chat message', 'me: ' + msg+' sentOn : '+Date.now());
    socket.broadcast.emit('chat message',messagee.user +': ' + msg+' sentOn : '+Date.now());
  });
});

app.get('/users/:username', function(req,res){
user.findOne({name:req.params.username},function(err,result){
    if(err) console.log(err);
    if(!result){//no need.....
      res.render('welcome.ejs',{content:''});
    }
    else{
      message.find({},function(err,messageResults){
        res.render('index.ejs',{content: "hello",
          messages:messageResults.filter(function(message){
          return message.sentOn>result.date;
        })})
      })
    }
  })
})
user.remove(function(err){
  if(err) console.log(err);
  else console.log('removed');
})
