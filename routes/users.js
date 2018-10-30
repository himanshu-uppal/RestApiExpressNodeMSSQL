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

const router = Router()



router.post('/users',async (req,res)=>{
    let user = new User()
    console.log('users created')
    if(req.body){
        user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        console.log('body has data')
        user.save().then(()=>{
            res.json(user.toJSON())
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
             user.token = user.generateJwtToken()
             console.log(user.token)
             user.save().then(()=>{
                res.send(user.toJSON())
             })
             
         }
        })     
    }    
})

router.get('/user',auth.required,function(req, res) {    
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }    
        return res.json(user.toJSON());
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
            res.send(user.toJSON())
        })


    }    ,
    (error)=>{
        res.send('no user found')
    })
})


module.exports = router