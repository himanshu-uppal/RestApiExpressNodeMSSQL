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


module.exports = router