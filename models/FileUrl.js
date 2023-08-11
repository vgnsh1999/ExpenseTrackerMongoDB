const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileURLSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model('FileURL',fileURLSchema)












// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const FileUrl = sequelize.define('fileurl',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     userId:{
//         type:Sequelize.INTEGER
//     },
//     fileUrl:Sequelize.STRING,
//     date:Sequelize.DATE
// });

// module.exports = FileUrl;