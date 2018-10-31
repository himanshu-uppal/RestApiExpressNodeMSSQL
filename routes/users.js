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
        res.status(201).json(user.toSendJSON())
        console.log('user saved')
    }).catch(error=>{res.status(400).send(error.errors[0].message)})    
})

router.post('/users/login',async(req,res)=>{    
    if(req.body){
        User.findOne({where:{email:req.body.user.email}}).then((user)=>{            
         if(!user){
             res.sendStatus(401)
         }
         else{
             if(req.body.user.password != user.password){
                res.status(401).send('Incorrect password')
             }                    
            res.status(200).send(user.toSendJSON())
            
         }
        })     
    }    
})

router.get('/user',auth.required,function(req, res) {    
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(404); }         
        return res.status(200).json(user.toSendJSON());
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
            res.status(201).send(user.toSendJSON())
        })
    } ).catch(error=>{
        res.sendStatus(404)

    })
   
})


module.exports = router