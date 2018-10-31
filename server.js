const express = require('express')
const {db} = require('./models')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
}); 

app.use('/',require('./routes'))  //have to change this to /api

db.sync().then(()=>{
    console.log('Database Synced')
    app.listen(4444,()=>{
        console.log('Server started at http://localhost:4444')
    })
}).catch(console.error)

