const express = require('express')
const {db} = require('./models')

const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

db.sync().then(()=>{
    console.log('Database Synced')
    app.listen(4444,()=>{
        console.log('Server started at http://localhost:4444')
    })
}).catch(console.error)

