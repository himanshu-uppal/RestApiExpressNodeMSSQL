const {Router} = require('express')
const {User} = require('../models')

const router = Router()

router.get('/',async (req,res)=>{
    console.log('users fetched')
    res.send('users fetched')
})

router.post('/',async (req,res)=>{
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

router.post('/login',async(req,res)=>{
    
    if(req.body){
        User.findOne({where:{email:req.body.email}}).then((user)=>{            
         if(!user){
             res.send('Not registered user')
         }
         else{
             res.json('logged in successfully')
         }
        })
     
    }
    
})

module.exports = router