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
  date: Date
});
var user = mongoose.model('user', userSchema);

var messageSchema = mongoose.Schema({
  content: String,
  user: String,
  sentOn: Date,
});
var message = mongoose.model('message', messageSchema);

var con ='a';
app.get('/', function(req, res){
  res.render('welcome.ejs',{content:con})
});


/*user.find({},function(err,userResults){
  if(err) console.log(err);
  userResults.forEach(function(u_item, u_index){
  //  handleGetRequest(u_item);
  })
})*/

app.post('/putUsername',function(req,res){
  user.findOne({name:req.body.name},function(err,result){
    if(err) console.log(err);
    if(result){
      console.log('User Already Exists');
      res.redirect('/');
    }
    else{
      var user1 = new user({name:req.body.name,
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

app.post('/checkUsername',function(req,res){
  console.log('checking....');
  user.findOne({name:req.body.name},function(err,result){
  if(err) console.log(err);
  if(!result){
    console.log('not found');
    // con = 'signup first'
    res.redirect('/')
  }
  else {console.log(result);
  res.redirect('/users/'+req.body.name);}
})
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat messages', function(msg){
    var messagee = new message({content: msg,
    user:socket.handshake.headers.referer.split('/')[3],
  sentOn:Date.now()})
  messagee.save(function(err,messagee){
    if(err) console.log(err);
    console.log(messagee);
  })
    socket.emit('chat message', 'me: ' + msg+' sentOn : '+Date.now());
    socket.broadcast.emit('chat message', msg+' sentOn : '+Date.now());
  });
});

app.get('/users/:username', function(req,res){

  user.findOne({name:req.params.username},function(err,result){
    if(err) console.log(err);
    if(!result){
      res.render('welcome.ejs');
    }
    else{
      message.find({},function(err,messageResults){
        res.render('index.ejs',{messages:messageResults.filter(function(message){
          return message.sentOn>result.date;
        })})
      })
    }
  })
})

/*function handleGetRequest(user){
  app.get('/'+user.name,function(req,res){
    message.find({},function(err,messageResults){
      res.render('index.ejs',{messages:messageResults.filter(function(message){
        return message.sentOn>user.date;
      })})
    })
  })
}
*/
