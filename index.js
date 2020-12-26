var express = require('express');
const bodyParser =require('body-parser');
const passport= require('passport');
const session= require('express-session');
const localStrategy= require('passport-local');
const fs =require('fs');
const mysql = require('mysql');
var app= express();
app.listen(3000,()=> console.log('server is running....'));



app.use(express.static('assets'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(session({
    secret:'something',
    cookiew:{
        maxAge:100*50*5
    }
}));
app.use(passport.session());

app.set('views','./views');
app.set('view engine','ejs');


app.get('/',function(req,res){
    res.render('index');
})
app.get('/loginok',function(req,res){
    res.send('Be Successful....');
})


app.route('/login')
.get((req,res)=>res.render('login'))
.post(passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/loginOk',
    failureFlash:true
}));

passport.use(new localStrategy(
    (username,password,done)=>{
            fs.readFile("./userDB.json",(err,data)=>{
                const db=JSON.parse(data);
              const  userRecord= db.find(user=> user.usr==username);
              if(userRecord && userRecord.pwd==password){
                  return done(null, userRecord);
              }else {
                  return done(null,false);
              }
            })
    }
));

passport.serializeUser((username,done)=>{
    done(null,username);
})
passport.deserializeUser((name, done) => {
    
    fs.readFile('./userDB.json',(err,data)=>{
        const db= JSON.parse(data);
        const userRecord= db.find(user=>user.usr==name);
        if(userRecord){
            return done(null,userRecord);
        }
        else{
            return done(null,userRecord);
        }
    })
})

