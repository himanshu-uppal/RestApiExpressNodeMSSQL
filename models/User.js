const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes

module.exports = {
    user:{
        email:{
            type:DT.STRING(100),
            validate:{isEmail:{msg:"Must be in email format"}},
            unique:{msg:'Email is already taken'}
        },
        token:{
            type:DT.STRING(200)
        },
        username:{
            type:DT.TEXT('tiny'),
            unique:{msg:'Username is already taken'}
            
        },
        bio:{
            type:DT.TEXT
        },
        image:{
            type:DT.STRING(100)
        }
    }
}

//password to save




   
 
  
