/*
GET /api/tags
*/
const {Router} = require('express')

const router = Router()

router.get('/',async(req,res)=>{
    res.send('tags')
})

module.exports = router