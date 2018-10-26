const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes

module.exports = {
    article:{
        slug:{
            type:DT.STRING(100)
        },
        title:{
            type:DT.STRING(100)
        },
        description:{
            type:DT.TEXT('tiny')
            
        },
        body:{
            type:DT.TEXT
        }
    }
}

   
 
  
