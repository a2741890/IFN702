var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var cors = require('cors');
var session = require("express-session");
const fetch = require("node-fetch");

global.userName = '';
global.userEmail = '';
app.use(cors());     

// 新增邏輯
app.use(express.static(path.join(__dirname, 'build')));
  // 增加 body 解析
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));

  
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  app.post('/', function(req, res) {
    // console.log("Hiii"+JSON.stringify(req.session));
    // global.userName = req.body["userName"];
    // global.userEmail = req.body["userEmail"];
    res.redirect('/');
  });

app.post('/code', function(req, res){
  let code = req.body["code"];
  let userName = req.body["userName"];
  let userEmail = req.body["userEmail"];
  console.log("Hiii"+userName+userEmail);
  let refreshToken = '';
  var details = {
          'client_id': '59d86960-9f67-4980-8297-e8f2f4edb685',
          'scope':'user.read%20mail.read',
          'code': code,
          'redirect_uri':'http://localhost:3000/',
          'grant_type':'authorization_code',
          'client_secret':'yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69'
};

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

    fetch("https://login.microsoftonline.com/chen.onmicrosoft.com/oauth2/token",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
        })
        .then(res => res.json())
        .then(
          (result) => {
            refreshToken = result.refresh_token;
            // 建立連線
        var mysql = require('mysql');
        var conn = mysql.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'a2370307',
        database : 'IFN702'
        });
        // 建立連線後不論是否成功都會呼叫
        conn.connect(function(err){
        if(err) throw err;
        console.log('connect success!');
        });
  
        // 其他的資料庫操作，位置預留
        let existUser ='';
        var query_string_search = 'SELECT * FROM `user` where `userName` ="'+userName+'"';
        console.log(query_string_search);
        setTimeout((r)=>{conn.query(query_string_search, function(err, result){
          if(err) throw err;
          console.log("R is hereeeeeeeeee");
          console.log(refreshToken);
          if(result[0] !== undefined)
          {
          existUser = result[0].userName;
          }

          console.log(result);
          if(existUser !== userName){
            var query_string_insert = 'INSERT INTO `user` SET `timestamp`="1", `client_ID`= "59d86960-9f67-4980-8297-e8f2f4edb685", `client_Secret`="yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69", `userName`="'+userName+'", `userEmail`="'+userEmail+'", `refreshToken`="'+refreshToken+'"';
            conn.query(query_string_insert, function(err, result){
              if(err) throw err;
              console.log(result);
              });
              // 關閉連線時呼叫
            conn.end(function(err){
              if(err) throw err;
              console.log('connect end');
              });
          }
          else{
              // 關閉連線時呼叫
          conn.end(function(err){
            if(err) throw err;
            console.log('connect end');
            });
            return "ERROR: This email has been registered!";
          }
          });}, 20, refreshToken)
          
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        )

      

      
      res.send("Finished!");
})

app.get('/getEvent',function(req,res){
      function callback(access_token){
      fetch('https://graph.microsoft.com/beta/users/william@chen.onmicrosoft.com/calendar/events',{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ access_token,
        'Prefer': 'outlook.timezone = "E. Australia Standard Time"'
      },
      }).then(res => res.json())
      .then(
        (result) => {
          res.send(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          res.send(error);
        }
      )};
      console.log(req.query.id);
      getAccessToken(req.query.id,callback);
})

app.post('/createEvent',function(req,res){
  let date = req.body["selectedDates"][0];
  let subject = req.body["subject"];
  let message = req.body["message"];
  let email = req.body["email"];
  let name = req.body["name"];
  function callback(access_token){
  fetch("https://graph.microsoft.com/beta/users/william@chen.onmicrosoft.com/calendar/events",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ access_token
      },
      body: JSON.stringify({
        "subject": subject,
        "body": {
          "contentType":"HTML",
          "content": message
        },
        "start": {
          "dateTime": date,
          "timeZone": "Australian Eastern Standard Time"
      },
      "end": {
          "dateTime": date,
          "timeZone": "Australian Eastern Standard Time"
      },
      "attendees":[
        {
          "emailAddress":{
            "address": email,
            "name": name
          },
        }
      ]
      })
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
    }
    getAccessToken(req.query.id,callback);
  res.status(200).json("Event created!");
});


app.get('/configuration',function(req,res){
  var conn = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'a2370307',
    database : 'IFN702'
    });
  conn.connect(function(err){
    if(err) throw err;
    console.log('connect success!');
    });app.post('/configuration',function(req,res){

  // 其他的資料庫操作，位置預留
  conn.query('SELECT * FROM `user` WHERE `userName`="'+userName+'"', function(err, result, fields){
    if(err) throw err;
    console.log(result);
    if(result !== undefined){

      res.json({ 
        startHour: result[0].startHour, 
        finishHour: result[0].finishHour,
        values: result[0].values
      });
      // 關閉連線時呼叫
      conn.end(function(err){
        if(err) throw err;
        console.log('connect end');
        });
    }
    else{
      // 關閉連線時呼叫
      conn.end(function(err){
        if(err) throw err;
        console.log('connect end');
        });
    res.send("Fail");
    }
})

app.post('/configuration',function(req,res){
  let startHour = req.body["startHour"];
  let finishHour = req.body["finishHour"];
  let values = req.body["values"];
  let userName = req.body["userName"];

  // 建立連線
  var conn = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'a2370307',
    database : 'IFN702'
    });
  conn.connect(function(err){
    if(err) throw err;
    console.log('connect success!');
    });app.post('/configuration',function(req,res){

  // 其他的資料庫操作，位置預留
  conn.query('UPDATE `user` SET `startHour`='+startHour+', `finishHour`="'+finishHour+', `values`="'+values+'"WHERE `userName`="'+userName+'"', function(err, result, fields){
    if(err) throw err;
    console.log(result);
})
  // 關閉連線時呼叫
  conn.end(function(err){
    if(err) throw err;
    console.log('connect end');
    });

})


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

function getAccessToken (id,callback){
  //Get accessToken
    var last_timestamp;
    var current_timestamp = Date.parse(new Date());
    var access_token;
  // 建立連線
  var conn = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'a2370307',
    database : 'IFN702'
    });
    // 建立連線後不論是否成功都會呼叫
    conn.connect(function(err){
      if(err) throw err;
      console.log('connect success!');
      });

    // 其他的資料庫操作，位置預留
    conn.query("SELECT `timestamp` FROM `user` WHERE `id`="+id, function(err, result, fields){
      if(err) throw err;
      if(result[0] !== undefined){
      last_timestamp = result[0].timestamp;
      }
      if(current_timestamp/1000 > parseInt(last_timestamp)){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
      console.log("State: " + this.readyState);
      if (this.readyState === 4) {
      console.log("Complete.\nBody length: " + this.responseText.length);
      access_token = JSON.parse(this.responseText).access_token;
      var expired_timestamp = JSON.parse(this.responseText).expires_on;
      var query_string = 'UPDATE `user` SET `accessToken`="'+access_token+'", `timestamp`="'+expired_timestamp+'" WHERE `id`='+id;
      conn.query(query_string, function(err, result){
        if(err) throw err;
        //console.log(result);
        console.log('Access token retrieved successfully!');
        callback(access_token);
        // 關閉連線時呼叫
        conn.end(function(err){
          if(err) throw err;
          console.log('connect end');
          });
      })
      }
    }
      conn.query('SELECT `refreshToken` FROM `user` WHERE `id`='+id, function(err, result, fields){
        if(err) throw err;
        let refreshToken = result[0].refreshToken;
        //console.log(result);
      var body = 'client_id=59d86960-9f67-4980-8297-e8f2f4edb685&client_secret=yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69&grant_type=refresh_token&redirect_uri=http://localhost:3000/&&scope=calendar.read%20calendar.readwrite&refresh_token='+ result[0].refreshToken;
      xhr.open('POST','https://login.microsoftonline.com/chen.onmicrosoft.com/oauth2/token', true);
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhr.send(body);
      });   
      
    }
      else{
        const getToken = function(){
          const promise = new Promise(function(resolve, reject){
            conn.query('SELECT `accessToken` FROM `user` WHERE `id`='+id, function(err, result, fields){
              if(err) throw err;
              //console.log(result);
              if(result[0] !== undefined){
              access_token = result[0].accessToken;
              //console.log(access_token);
              }
              if(access_token != null){
                resolve(access_token);
              }
            })  
          });
            return promise;
        };
        
        getToken().then(function(access_token){
          // 關閉連線時呼叫
        conn.end(function(err){
          if(err) throw err;
          console.log("Hiii");
          console.log('connect end');
          });
          console.log('Access token retrieved successfully!');
          callback(access_token);
        });
        }
        
    })
  }

// 監聽 port
var port = process.env.PORT || 3001;
app.listen(port);
