/*
POST /api/users/login
POST /api/users
GET /api/user
PUT /api/user


*/

const {Router} = require('express')
const {User} = require('../models')
const auth = require('./auth')
const {Sequelize} = require('sequelize')

const router = Router()



router.post('/users',async (req,res)=>{
    User.create({
        username :req.body.user.username,
        email :req.body.user.email,
        password :req.body.user.password
    }).then((user)=>{               
        res.json(user.toSendJSON())
        console.log('user saved')
    }).catch(error=>{res.send(error.errors[0].message)})    
})

router.post('/users/login',async(req,res)=>{    
    if(req.body){
        User.findOne({where:{email:req.body.user.email}}).then((user)=>{            
         if(!user){
             res.send('Not registered user')
         }
         else{
             if(req.body.user.password != user.password){
                res.send('Incorrect password')
             }                    
            res.send(user.toSendJSON())
            
         }
        })     
    }    
})

router.get('/user',auth.required,function(req, res) {    
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }         
        return res.json(user.toSendJSON());
      })
    })


    
router.put('/user',auth.required,function(req,res){

    const user = User.findById(req.payload.id).then((user)=>{
        if(req.body.user.email){
            user.email = req.body.user.email
        }
        if(req.body.user.bio){
            user.bio = req.body.user.bio
        }
        if(req.body.image){
            user.image = req.body.user.image
        }
        user.save().then((user)=>{
            res.send(user.toSendJSON())
        })
    }    ,
    (error)=>{
        res.send('no user found')
    })
})


module.exports = router