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
    let tags
    let whereClause = []
    let offset=0,limit=10
    for(key of Object.keys(req.query)){
        switch(key){
            case 'tag': console.log('tag') 
            console.log(req.query.tag)
            tags = await Tag.findAll({where:{name:{[Op.like]:'%'+req.query.tag+'%'}}})  //alternate
            //tags = await Tag.findOne({where:{name:{[Op.like]:'%'+req.query.tag+'%'}}})           
            break;
            case 'author': console.log('author')
            if(req.query.author){
                console.log('author='+req.query.author);
                 await User.findOne({                    
                    where:{username:req.query.author}
                }).then((user)=>{                    
                   if(user){
                    whereClause.push({userId:user.id})
                   }   
                   else{
                       res.status(200).json({
                           articles:[],
                           articlesCount:0
                       })
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
   
    let articles = await Article.findAll({
        where:{
             [Op.and]:whereClause
            
        },
        offset:offset,
        limit:limit,
        include:[{model:User,attributes:['username','bio','image']},{model:Tag,attributes:['name']}],
        order:[['createdAt','DESC']]
     
    })

    if(tags){
        const findTagArticles = async function(){
            let allArticlekeys = new Set();
            for(let article of articles){
                allArticlekeys.add(article.id)
        }

        console.log(allArticlekeys)

        let tagArticleKeys = new Set();      
        for(let tag of tags){                    //alternate
            const articles = await tag.getArticles()
            for(let article of articles){
                tagArticleKeys.add(article.id)
            }            
        } 

        // const tagArticlesFetched = await tags.getArticles()  //alternate
        // for(let article of tagArticlesFetched){            //alternate
        //              tagArticleKeys.add(article.id) //alternate
        //      }                                       //alternate
        let resultArticlesKeys = new Set(
            [...allArticlekeys].filter(x => tagArticleKeys.has(x)));
    

        const resultArticles = await Article.findAll({where:{id:[...resultArticlesKeys]},include:[{model:User,attributes:['username','bio','image']},{model:Tag,attributes:['name']}], order:[['createdAt','DESC']]})
       articles = resultArticles     


        }
        await findTagArticles()
        
    }

    const abc = async function (){
        let newArticles = []

        const def = async function(){ 
            for(let article of articles){
                const articleTags = await article.getTags({attributes:['name']})

                    let tagList =[]            
                    for(tag of articleTags){
                        tagList.push(tag.name)
                    }
                    newArticles.push(article.toSendManyJSON(tagList))
               
              }   
            }
             await def();
             res.status(200).json({
                articles:newArticles,
                articlesCount:newArticles.length
            })             
                
          }
        await abc();      
        
     
})
router.get('/:slug',async(req,res)=>{    
    const article = await Article.findOne({
        where:{
            slug:req.params.slug
        },
        include:[{model:User,attributes:['username','bio','image']},{model:Tag,attributes:['name']}]
    }).then((article)=>{  
        article.getTags({attributes:['name']}).then((articleTags)=>{ 
        let tagList =[]
        for(tag of articleTags){
            tagList.push(tag.name)
        }
        res.status(201).json(article.toSendJSON(tagList))   
       
    })
    }).catch(error=>{
        res.sendStatus(404)
    })
    
})
router.post('/',auth.required,async(req,res)=>{    
    if(req.body.article != '' && (req.body.article.title == '' ||  req.body.article.description == ''||    req.body.article.body == '') ){
            res.sendStatus(400)
    }

    const tagList =[...new Set(req.body.article.tagList)];
    let tagsCreated =[]
    
    for(tag in tagList){

   await Tag.findOrCreate({where:{name:tagList[tag]}  }).spread((tagFoundOrCreated,created)=>{
      // console.log(tagFoundOrCreated.id)
           tagsCreated.push(tagFoundOrCreated)
   })

   

              
    }



  Article.create({
        title:req.body.article.title,
        description:req.body.article.description,
        body:req.body.article.body,
        userId:req.payload.id,
        slug:Article.generateSlug(req.body.article.title),
    }).then((article)=>{    
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

})

router.put('/:slug',auth.required,function(req,res){
    const article = Article.findOne({where:{slug:req.params.slug},
        include:[{model:User,attributes:['username','bio','image']},{model:Tag,attributes:['name']}]        
    }).then((article)=>{    
        if(req.payload.id == article.userId){
            if(req.body.article.title )
            article.title = req.body.article.title
            if(req.body.article.description )
            article.description = req.body.article.description
            if(req.body.article.body )
            article.body = req.body.article.body
            article.save().then((article)=>{                
                article.getTags({attributes:['name']}).then((articleTags)=>{ 
                    let tagList =[]
                    for(tag of articleTags){
                        tagList.push(tag.name)
                    }
                    res.status(201).json(article.toSendJSON(tagList))   
                   
                })
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
   const article = await  Article.findOne({where:{slug:req.params.slug}})
   if(!article){
    res.sendStatus(404)
}
   const user = await User.findOne({where:{id:req.payload.id}})
   if(!user){
       res.sendStatus(404)
   }
  
   const comment = await Comment.findOne({where:{id:req.params.id}})
   if(!comment){
    res.sendStatus(404)
}

    //const commentAuthor = await User.findOne({where:{id:comment.userId}})

    if(comment.userId != user.id){
        res.sendStatus(403)

    }

   comment.destroy().then((result)=>{
    res.sendStatus(200)

   }).catch(error=>{
         res.sendStatus(404)
     })
   

        




    //     const comment = Comment.findOne({where:{id:req.params.id}}).then((comment)=>{  
    //         if(comment.articleId == article.id){
    //             comment.destroy()
    //             res.sendStatus(200)

    //         }         
           
            
    //     })       
       
    // }).catch(error=>{
    //     res.sendStatus(404)
    // })
})


    
    




module.exports = router



