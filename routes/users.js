const {Router} = require('express')

const router = Router()

router.get('/',(req,res)=>{
    console.log('users fetched')
    res.send('users fetched')
})

router.post('/',(req,res)=>{
    console.log('users created')
    res.send('users created')
})

module.exports = router