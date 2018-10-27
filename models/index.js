const Sequelize = require('sequelize')
const {article} = require('./Article')
const {user} = require('./User')
const {comment} = require('./Comment')
const {tag} = require('./Tag')

const db = new Sequelize({
    dialect:'mssql',
   username:'test',
   database:'test',
   password:'test',
   //host:'10.175.12.90',
   host:'192.168.1.6',
   port:1433
})

const Article = db.define('article',article)
const User = db.define('user',user)
const Comment = db.define('comment',comment)
const Tag = db.define('tag',tag)


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