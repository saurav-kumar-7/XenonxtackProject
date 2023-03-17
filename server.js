var mysql = require('mysql');
var express = require("express");
var urlencodedParser=express.urlencoded({extended : true});
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "10447",
  database: "mydb"
});

var app = express();

//app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static("public"));

app.get('/',(req,res)=>{
  res.sendFile('index.html');
});

app.get('/men.html',(req,res)=>{
  res.sendFile('men.html');
});

app.get('/women.html',(req,res)=>{
  res.sendFile('women.html');
});

app.get('/kids.html',(req,res)=>{
  res.sendFile('kids.html');
});

app.post('/dosignin',urlencodedParser, (req,res)=>{
  connection.connect(function(err){
  var username = req.body.username;
	var password = req.body.password;
  console.log(username, password);
	if (username && password) {
		connection.query('SELECT * FROM userlogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if(err)
      {
        res.send("failed");
        res.end();
        return;
      };
      if (results.length > 0) {
				res.send("Sign-In Successful");
			}
      else 
      {
				res.send('Incorrect Username and/or Password!');
			}	
			res.end();
		});
	} 
  else 
  {
		res.send('Please enter Username and Password!');
		res.end();
	}
});
});

app.post('/dosignup',urlencodedParser, (req,res)=>{
  connection.connect(function(err){
  var username = req.body.username;
	var password = req.body.password;
  var cnfrmpass= req.body.cnfrmpass;
  inputData={username: username, password: password};
  console.log(username, password, cnfrmpass);
  console.log(inputData);
		connection.query("SELECT * FROM userlogin where username=?", [username], function (err, results, fields) {
      console.log(results);
      if (err)
      {
        res.send("Failed")
        res.end()
        return;
      };
      if(results.length>0)
      {
          res.send("Username Already Exist")
          res.end()
      }
      else if(cnfrmpass!=inputData.password)
      {
        res.send("Password & Confirm Password did not Match")
        res.end()
      }
      else
      {
        connection.query("INSERT INTO userlogin SET ?", inputData, function (err, results, fields) {
        if (err)
        {
          res.send("failed")
          res.end()
          return;
        };
        res.send("Sign-Up successful")
         //res.end()
         return;
		  });
	    }
  }); 
});
});

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})