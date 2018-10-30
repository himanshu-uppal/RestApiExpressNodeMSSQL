/*
POST /api/users/login
POST /api/users
GET /api/user
PUT /api/user


GET /api/profiles/:username
POST /api/profiles/:username/follow
DELETE /api/profiles/:username/follow
*/

const {Router} = require('express')
const {User} = require('../models')
const auth = require('./auth')
const {Sequelize} = require('sequelize')

const router = Router()



router.post('/users',async (req,res)=>{
    let user = new User()
    console.log('users created')
    if(req.body){
        user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        user.save().then(()=>{
            User.findOne({where:{username:user.username}}).then()
            res.json(user.toSendJSON())
            console.log('user saved')
        },
        error=>{
            if(error instanceof Sequelize.ValidationError) {
              res.send(error.errors[0].message) //to change the message access way
            }
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
             user.token = user.generateJwtToken()
             console.log(user.token)
             user.save().then(()=>{
                res.send(user.toSendJSON())
             })
             
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
        if(req.body.email != user.email){
            user.email = req.body.email
        }
        if(req.body.bio != user.bio){
            user.bio = req.body.bio
        }
        if(req.body.image != user.image){
            user.image = req.body.image
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