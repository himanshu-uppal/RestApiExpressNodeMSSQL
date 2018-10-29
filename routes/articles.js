/*
GET /api/articles ?tag, ?author, ?favorited, ?limit, ?offset
GET /api/articles/feed
GET /api/articles/:slug
POST /api/articles
PUT /api/articles/:slug
DELETE /api/articles/:slug
POST /api/articles/:slug/comments
GET /api/articles/:slug/comments
DELETE /api/articles/:slug/comments/:id

*/

// accessing url params - req.params.id


const {Sequelize} = require('sequelize')
const {Router} = require('express')
const {Article,User} = require('../models')
const auth = require('./auth')
const Op = Sequelize.Op


const router = Router()
 
router.get('/',async(req,res)=>{
    let whereClause = []
    let offset=0,limit=10
    for(key of Object.keys(req.query)){
        switch(key){
            case 'tag': console.log('tag') 
            //whereClause.push({tag:req.query.tag})
            break;
            case 'author': console.log('author')
            if(req.query.author){
                console.log('author='+req.query.author);
                const user = await User.findOne({                    
                    where:{username:req.query.author}
                }).then((user)=>{                    
                   if(user){
                    whereClause.push({userId:user.id})
                   }              
                     
                })
                }
             
            break;
            case 'limit': console.log('limit') 
                  if(req.query.limit){
                      limit = parseInt(req.query.limit)
                  }      
            break;
            case 'offset': console.log('offset') 
            if(req.query.offset){
                offset = parseInt(req.query.offset)
            } 
            break;
        }
    }
    const articles = await Article.findAll({
        where:{
             [Op.and]:whereClause
            
        }   ,
        offset:offset,
        limit:limit 

        
    }).then((result)=>{
        res.send(result)
    })
    
})
router.get('/:slug',async(req,res)=>{
    
    const article = await Article.findAll({
        where:{
            slug:req.params.slug
        }
    }).then((article)=>{
        res.send(article)
    })
    
})
router.post('/',auth.required,function(req,res){

    //fetch user
    const article = new Article()    
        article.slug=req.body.slug,
        article.title=req.body.title,
        article.description=req.body.description,
        article.body=req.body.body
        article.userId = req.payload.id
        article.save()     

    res.send(article)
    
})

router.put('/:slug',auth.required,function(req,res){
    const article = Article.findOne({where:{slug:req.params.slug},
        include:[User]        
    }).then((article)=>{
        if(!article){
            res.send('no article')
        }
       // res.send(article)
        console.log('user id ='+req.payload.id)
        console.log(article)
        console.log('article author='+article.userId)     
       // console.log(article.user)
        if(req.payload.id == article.userId){
            if(req.body.title != article.title )
            article.title = req.body.title
            if(req.body.slug != article.slug )
            article.slug = req.body.slug
            if(req.body.description != article.description )
            article.description = req.body.description
            if(req.body.body != article.body)
            article.body = req.body.body
           // console.log('in article update')
            article.save().then(()=>{
                res.send(article)
            })
        }
        else{
            res.send('not article author')

        }

    },
    (error)=>{
        res.send('no article found')
    })
    

})

module.exports = router



