var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var cors = require('cors');
const fetch = require("node-fetch");

app.use(cors());     

// 新增邏輯
app.use(express.static(path.join(__dirname, 'build')));
  // 增加 body 解析
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));
  
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.get('/getEvent',function(req,res){
      function callback(access_token){
      fetch("https://graph.microsoft.com/beta/users/william@chen.onmicrosoft.com/calendar/events",{
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

      getAccessToken(callback);
      
  
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
    getAccessToken(callback);
  res.status(200).json("Event created!");
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

function getAccessToken (callback){
  
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
    conn.query("SELECT `timestamp` FROM `user` WHERE `id`=1", function(err, result, fields){
      if(err) throw err;
      last_timestamp = result[0].timestamp;
  
      if(current_timestamp/1000 > parseInt(last_timestamp)){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
      console.log("State: " + this.readyState);
                              
      if (this.readyState === 4) {
      console.log("Complete.\nBody length: " + this.responseText.length);
      access_token = JSON.parse(this.responseText).access_token;
      var expired_timestamp = JSON.parse(this.responseText).expires_on;
  
      var query_string = 'UPDATE `user` SET `accessToken`="'+access_token+'", `timestamp`="'+expired_timestamp+'" WHERE `id`=1';
      conn.query(query_string, function(err, result){
        if(err) throw err;
        console.log(result);
        conn.end(function(err){
          if(err) throw err;
          console.log('connect end');
          })    
        });
        console.log('Access token retrieved successfully!');
        callback(access_token);
      }
      };                      
      var body = 'client_id=59d86960-9f67-4980-8297-e8f2f4edb685&client_secret=yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69&grant_type=client_credentials&resource=https://graph.microsoft.com';
      xhr.open('POST','https://login.microsoftonline.com/chen.onmicrosoft.com/oauth2/token', true);
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhr.send(body);        
      }
      else{
        const getToken = function(){
          const promise = new Promise(function(resolve, reject){
            conn.query("SELECT `accessToken` FROM `user` WHERE `id`=1", function(err, result, fields){
              if(err) throw err;
              access_token = result[0].accessToken;
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
