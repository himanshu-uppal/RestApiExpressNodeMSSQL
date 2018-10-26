const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes

const db = new Sequelize({
    dialect:'mssql',
    username:'test',
    database:'test',
    password:'test',
    host:'127.0.0.1',
    port:1433
})

const Task = db.define('task',{
    name:{
        type:DT.STRING(50),
        allowNull:false
    },
    priority:{
        type:DT.INTEGER(),
        defaultValue:0
    }
})

async function init(){
    db.sync()
    db.authenticate()
}

init()