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
const {Article,User,Comment,Tag} = require('../models')
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
                    where:{username:req.query.author},
                    include:[User]
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
            
        },
        offset:offset,
        limit:limit,
        include:[{model:User,attributes:['username','bio','image']}]
        
    }).then((articles)=>{
        let newArticles = []
        for(let article of articles){
            newArticles.push(article.toSendManyJSON())
        }
        res.status(200).json({
            articles:newArticles,
            articlesCount:articles.length
        })
    }).catch(error=>{
        res.sendStatus(404)
    })
    
})
router.get('/:slug',async(req,res)=>{    
    const article = await Article.findOne({
        where:{
            slug:req.params.slug
        },
        include:[{model:User,attributes:['username','bio','image']}]
    }).then((article)=>{
        res.status(200).json(article.toSendJSON())
    }).catch(error=>{
        res.sendStatus(404)
    })
    
})
router.post('/',auth.required,function(req,res){    
    if(req.body.article != '' && (req.body.article.title == '' ||  req.body.article.description == ''||    req.body.article.body == '') ){
            res.sendStatus(400)
    }

    const tags =['tag1','tag2','tag3','tag4']
    let tagsCreated =[]
    for(tag in tags){
       Tag.create({
            name:tags[tag]
        }).then((tag)=>{
            tagsCreated.push(tag)
        })
    }



  Article.create({
        title:req.body.article.title,
        description:req.body.article.description,
        body:req.body.article.body,
        userId:req.payload.id,
        slug:Article.generateSlug(req.body.article.title),
    }).then((article)=>{
        // for(tag of tagsCreated){
        //     article.addTag(tag)
        // }
        article.setTags(tagsCreated)
        Article.findOne({
            where:{slug:article.slug},
            include:[{model:User,attributes:['username','bio','image']}]
        }).then((article)=>{
            article.getTags({attributes:['name']}).then((articleTags)=>{ 
                let tagList =[]
                for(tag of articleTags){
                    tagList.push(tag.name)
                }
                res.status(201).json(article.toSendJSON(tagList))   
               
            })
           
        })

    }).catch(error=>{
        res.status(400)
    }) 

//    then(()=>{
//             Article.findOne({
//                 where:{slug:article.slug},
//                 include:[{model:User,attributes:['username','bio','image']}]
//             }).then((article)=>{
//                 res.status(201).json(article.toSendJSON())
//             })
//         }) 
})

router.put('/:slug',auth.required,function(req,res){
    const article = Article.findOne({where:{slug:req.params.slug},
        include:[{model:User,attributes:['username','bio','image']}]        
    }).then((article)=>{    
        if(req.payload.id == article.userId){
            if(req.body.article.title )
            article.title = req.body.article.title
            if(req.body.article.description )
            article.description = req.body.article.description
            if(req.body.article.body )
            article.body = req.body.article.body
            article.save().then(()=>{
                res.status(201).json(article.toSendJSON())
            })
        }
        else{
            res.sendStatus(403) //dont have permission

        }

    }).catch(error=>{
        res.sendStatus(404)

    })
    
})


router.delete('/:slug',auth.required,function(req,res){
    const article = Article.findOne({where:{slug:req.params.slug},
        include:[User]        
    }).then((article)=>{
     
        if(req.payload.id == article.userId){
          
            article.destroy().then(()=>{
                res.sendStatus(200)
            })
        }
        else{
            res.sendStatus(403) //dont have permission


        }
    }).catch(error=>{
        res.sendStatus(404)
    })
  
})

router.post('/:slug/comments',auth.required,async(req,res)=>{

    Article.findOne({where:{slug:req.params.slug}}).then((article)=>{
        const comment = Comment.create({
            body : req.body.comment.body,
            userId:req.payload.id,
            articleId :article.id 
        }).then((comment)=>{
            Comment.findOne({where:{id:comment.id},include:[{model:User,attributes:['username','bio','image']}]}).then((comment)=>{
                res.status(200).json(comment.toSendJSON())
            })            
        }).catch(error=>{
            res.sendStatus(404)
        })      
       
    })
})

router.get('/:slug/comments',async(req,res)=>{
    Article.findOne({where:{slug:req.params.slug}}).then((article)=>{
        const comments = Comment.findAll({where:{articleId:article.id},include:[{model:User,attributes:['username','bio','image']}]}).then((comments)=>{
            let allComments = []
            for(let comment of comments){
                allComments.push(comment.toSendManyJSON())
            }
            res.status(200).json({
                comments:allComments
            })
            
        })       
       
    }).catch(error=>{
        res.sendStatus(404)
    })
})

router.delete('/:slug/comments/:id',auth.required,async(req,res)=>{
    Article.findOne({where:{slug:req.params.slug}}).then((article)=>{
        const comment = Comment.findOne({where:{id:req.params.id}}).then((comment)=>{           
           comment.destroy()
           res.sendStatus(200)
            
        })       
       
    }).catch(error=>{
        res.sendStatus(404)
    })
})


    
    




module.exports = router



