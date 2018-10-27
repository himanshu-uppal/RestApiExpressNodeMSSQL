const {Router} = require('express')
const {User} = require('../models')
const auth = require('./auth')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/users',async (req,res)=>{
    console.log('users fetched')
    res.send('users fetched')
})

router.post('/users',async (req,res)=>{
    let user = new User()
    console.log('users created')
    if(req.body){
        user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        console.log('body has data')
        user.save().then(()=>{
            res.json(user)
            console.log('user saved')
        })
        
    }    
})

router.post('/users/login',async(req,res)=>{
    
    if(req.body){
        User.findOne({where:{email:req.body.email}}).then((user)=>{            
         if(!user){
             res.send('Not registered user')
         }
         else{
             user.token = jwt.sign({
                id: user.id,
                username: user.username,
              }, 'himanshu')
             res.send(user.token)
         }
        })     
    }    
})

router.get('/user',auth.required,function(req, res) {    
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }    
        return res.json(user);
      })
    })


/* to be used in this file 
var jwt = require('express-jwt');

app.get('/protected',
  jwt({secret: 'shhhhhhared-secret'}),
  function(req, res) {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
  });

  */

module.exports = router