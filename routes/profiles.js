/*
GET /api/profiles/:username
POST /api/profiles/:username/follow
DELETE /api/profiles/:username/follow
*/
const {Router} = require('express')
const auth = require('./auth')
const {User} = require('../models')

const router = Router()

router.get('/:username',auth.required,function(req,res){
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }    
        return res.json(user.toSendProfileJSON());
      })

})

module.exports = router



