/*
GET /api/tags
*/
const {Router} = require('express')
const {Tag} = require('../models')

const router = Router()

router.get('/',async(req,res)=>{
    Tag.findAll().then((tags)=>{
        allTags = []
        for(tag of tags){
            allTags.push(tag.toSendJSON())

        }
        res.status(200).json({tags:allTags})
    })
})

module.exports = router