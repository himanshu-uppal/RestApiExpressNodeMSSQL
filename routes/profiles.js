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
    res.send(req.params.username)

})

module.exports = router



