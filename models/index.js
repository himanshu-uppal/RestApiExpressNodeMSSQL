const Sequelize = require('sequelize')
const {article} = require('./Article')
const {user} = require('./User')
const {comment} = require('./Comment')
const {tag} = require('./Tag')
const jwt = require('jsonwebtoken')
const slug = require('slug')

const db = new Sequelize({
    dialect:'mssql',
   username:'test',
   database:'test',
   password:'test',
   host:'10.175.14.46',
   //host:'192.168.1.6',
   //host:'192.168.43.52',
   port:1433
})

/* User Model */
const User = db.define('user',user)
User.prototype.generateJwtToken = function () {
    return jwt.sign({
        id: this.id,
        username: this.username,
      }, 'himanshu')
}

User.prototype.toSendJSON = function(){
    return  {
        user: {
              email: this.email,
              token: this.token,
              username: this.username,
              bio: this.bio,
              image: this.image
            }
          }    
}

User.prototype.toSendProfileJSON = function(){
    return  {
        profile: {
              username: this.username,
              bio: this.bio,
              image: this.image,
              following:'haha'
            }
          }    
}
/* Article Model */
const Article = db.define('article',article)
Article.prototype.toSendJSON = function(){
    return {
          article: {
          slug: this.slug,
          title: this.title,
          description: this.description,
          body: this.body,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt, 
          author:{
              username:this.user.username,
              bio:this.user.bio,
              image:this.user.image,
              following:'haha'
          }      
        }
      }
}

Article.prototype.toSendManyJSON = function(){
    return {         
          slug: this.slug,
          title: this.title,
          description: this.description,
          body: this.body,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt, 
          author:{
              username:this.user.username,
              bio:this.user.bio,
              image:this.user.image,
              following:'haha'
          }      
        }      
}

Article.prototype.generateSlug = function(){
    return slug(this.title)+'-'+Math.floor(1000+Math.random(1,100)*9000)
}

/* Comment Model */
const Comment = db.define('comment',comment)
Comment.prototype.toSendJSON = function(){
    return {
        comment: {
          id: this.id,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          body: this.body,
          author: {
            username: this.user.username,
            bio: this.user.bio,
            image: this.user.image,
            following: 'haha'
          }
        }
      }

}

Comment.prototype.toSendManyJSON = function(){
    return {
          id: this.id,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          body: this.body,
          author: {
            username: this.user.username,
            bio: this.user.bio,
            image: this.user.image,
            following: 'haha'
          }
        }
}

/* Tag Model */
const Tag = db.define('tag',tag)

/* Associations */
//Association between Article and User
Article.belongsTo(User)
User.hasMany(Article)

//Association between Comment and User
Comment.belongsTo(User)
User.hasMany(Comment)

//Association between Comment and Article
Comment.belongsTo(Article)
Article.hasMany(Comment)

//Association between Article and Tag
Tag.belongsToMany(Article,{through:'ArticleTag'})
Article.belongsToMany(Tag,{through:'ArticleTag'})

module.exports = {
    db,
   Article,
   User,
   Comment,
   Tag
  }
