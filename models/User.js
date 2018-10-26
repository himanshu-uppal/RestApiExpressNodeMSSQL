const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes

module.exports = {
    user:{
        email:{
            type:DT.STRING(100)
        },
        token:{
            type:DT.STRING(100)
        },
        username:{
            type:DT.TEXT('tiny')
            
        },
        bio:{
            type:DT.TEXT
        },
        image:{
            type:DT.STRING(100)
        }
    }
}


   
 
  
