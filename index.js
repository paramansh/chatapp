//ejs
//postman
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

var isLogggedIn = false;/////to be implemented

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

/*user.remove({name:'username'},function(err){
  if(err) console.log(err);
  else console.log('removed');
})*/
var con ='a'
app.get('/login', function(req, res){
  // res.sendFile(__dirname + '/welcome.html');
  res.render('welcome.ejs',{content:con})
});

/*app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});*/

/*app.get('/aw',function(req,res){
  message.find(function(err,results){
    if(err) console.log(err);
    res.render('index.ejs',{messages:results})
  })

})*/
/*user.find({},function(err,userResults){
  if(err) console.log(err);
//  console.log(userResults)
  userResults.forEach(function(u_item, u_index){
    app.get('/'+u_item.name,function(req,res){
    //  res.sendFile(__dirname + '/index.html');
    var messageArray = [];
   message.find({},function(err,messageResults){
        messageArray = messageResults.filter(function(message){
        return message.sentOn>u_item.date
      })
      console.log(messageArray);
    })

      message.find({},function(err,messageResults){
        var itemProcessed = 0;
        //console.log(messageResults);
        messageResults.forEach(function(m_item,m_index){
          itemProcessed++;
        //  console.log(m_item+m_index);
          if(m_item.sentOn>u_item.date)
          {
            messageArray.push(m_item);
            //console.log(messageArray);
            //console.log(m_item.content);
          }
      if(itemProcessed == messageResults.length){
          renderPage();
        }
        })//check only till first and then print others???


      })
      function renderPage(){
        res.render('index.ejs',{messages:messageArray})
      //  console.log(messageArray);
      }

    })
  //  console.log(index + ' \n' +  item.name);
  })
  //console.log(results);
})*/
function handleGetRequest(user){
  app.get('/'+user.name,function(req,res){
    message.find({},function(err,messageResults){
      res.render('index.ejs',{messages:messageResults.filter(function(message){
        return message.sentOn>user.date;
      })})
    })
  })
}
user.find({},function(err,userResults){
  if(err) console.log(err);
  userResults.forEach(function(u_item, u_index){
    handleGetRequest(u_item);
//     app.get('/'+u_item.name,function(req,res){
//       message.find({},function(err,messageResults){
//         res.render('index.ejs',{messages:messageResults.filter(function(message){
//           return message.sentOn > u_item.date;
//         })
//       })
//       console.log(messageResults.filter(function(messsage){
//         return message.sentOn > u_item.date;
//       }));
//       })
    // var messageArray = [];
    //   message.find({},function(err,messageResults){
    //     var itemProcessed = 0;
    //     messageResults.forEach(function(m_item,m_index){
    //       itemProcessed++;
    //       if(m_item.sentOn>u_item.date)
    //       {
    //         messageArray.push(m_item);
    //       }
    //     if(itemProcessed == messageResults.length){
    //       renderPage();
    //     }
    //     })
    //   })
    //   function renderPage(){
    //     res.render('index.ejs',{messages:messageArray})
    // }
    // })
  })
})


//signup
app.post('/putUsername',function(req,res){
  console.log('hi');
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

      console.log('request received');
      user1.save(function(err,user1){
        if(err) return console.log(err);
        console.log('saved to database');
        app.get('/'+user1.name,function(req,res){
          //res.sendFile(__dirname+'/index.html')
          var messageArray = [];
            message.find({},function(err,messageResults){
              var itemProcessed = 0;
              messageResults.forEach(function(m_item,m_index){
                itemProcessed++;
                if(m_item.sentOn>user1.date)
                {
                  messageArray.push(m_item);
                }
              if(itemProcessed == messageResults.length){
                renderPage();
              }
              })
            })
            function renderPage(){
              res.render('index.ejs',{messages:messageArray})
            }
        })
        res.redirect('/');
      })
    }
  })


  //res.redirect('/index.html');
})

//login
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
  res.redirect('/'+req.body.name);}
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
//console.log(socket.handshake.headers.referer.split('/')[3]);
    socket.emit('chat message', 'me: ' + msg+' sentOn : '+Date.now());
    socket.broadcast.emit('chat message', msg+' sentOn : '+Date.now());
  });
});

// app.listen(3000, function(){
//   console.log('listening on *:3000');
// });
// Why app.listen() not working
