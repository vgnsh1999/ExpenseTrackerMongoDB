const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    ispremiumuser:{
        type:Boolean,
        ref:'Order',
        required:true
    },
    totalExpense:{
        type:Number,
        ref:'Expense',
        required:true
    }
});

module.exports = mongoose.model('User',userSchema)





// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     username: Sequelize.STRING,
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true
//     },
//     password:Sequelize.STRING,
//     ispremiumuser:Sequelize.BOOLEAN,
//     totalExpense:{
//         type:Sequelize.INTEGER,
//         defaultValue:0
//     }
// });

// module.exports = User;