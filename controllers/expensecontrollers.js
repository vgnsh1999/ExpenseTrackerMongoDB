const Expense = require('../models/Expense');
const User = require('../models/User');
const FileUrl = require('../models/FileUrl');
// const sequelize = require('../util/database');
const AWS = require('aws-sdk');
require('dotenv').config();

const addExpense = async (req,res,next)=>{
    try{
        const {amount,description,category} = req.body;
        console.log(amount,description,category)
        if(amount === undefined || amount.length === 0){
            return res.status(400).json({message:'Parameters are missing',success:false});
        }
        const expense =  new Expense({
                amount:amount, 
                description:description, 
                category:category, 
                userId: req.user._id
            }); 
            await expense.save();
        const totalExpense = Number(req.user.totalExpense) + Number(amount);
        //console.log(totalExpense);
        await User.updateOne({_id:req.user._id},{totalExpense:totalExpense});
        res.status(201).json({newExpenseAdded:expense,success:true});
    } catch(error){
        return res.status(500).json({message:error,success:false});
    }
};


const getExpense = async (req,res,next)=>{
    try{
        const expenses = await Expense.find({userId:req.user._id}).limit(5);
        res.status(200).json({allExpenses:expenses,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};


const getExpenseOnPage2 = async (req,res,next)=>{
    try{
        const expenses = await Expense.find({userId:req.user._id}).skip(5).limit(5);
        res.status(200).json({allExpenses:expenses,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

const deleteExpense = async (req,res,next)=>{
    try{
        const expenseID = req.params.id;
        if(expenseID === undefined || expenseID.length === 0){
            return res.status(400).json({message:'Expense ID is missing',success:false});
        }
        const amountToBeDeleted = await Expense.find({_id:expenseID});
        const totalExpense = Number(req.user.totalExpense) - amountToBeDeleted[0].amount;
        await User.updateOne({_id:req.user._id},{totalExpense:totalExpense});

        const noofrows = await Expense.deleteOne({_id:expenseID});
        if(noofrows === 0){
            return res.status(404).json({message:'expense doesnot belongs to user'});
        }
        res.status(200).json({message:'Deleted Successfully',success:true});
    } catch(error){
        console.log(error)
        return res.status(500).json({message:error,success:false});
    }
};


const downloadexpense = async (req,res,next) =>{
    try{
        const expenses = await Expense.find({ userId:req.user._id });
        console.log(expenses);
        //we have to stringify before sending it to file
        const stringifiedExpenses = JSON.stringify(expenses);
        //filename should be depended upon userID
        const userId = req.user._id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses,filename);
        // const data = await FileUrl.save({userId:req.user._id,fileUrl:fileUrl});
        const fileUrls = new FileUrl({
            userId:req.user._id,
            fileUrl:fileUrl,
            date:new Date()
        });
        fileUrls.save();
        res.status(200).json({fileUrl:fileUrl,success:true}); 

    } catch(error){
        console.log(error);
        return res.status(500).json({fileUrl:'',error:error,success:false});
    }
};

// const downloadexpense = async (req,res,next) =>{
//     try{
//         const expenses = await Expense.findAll({ where: { userId:req.user.id }});
//         console.log(expenses);
//         //we have to stringify before sending it to file
//         const stringifiedExpenses = JSON.stringify(expenses);
//         //filename should be depended upon userID
//         const userId = req.user.id;
//         const filename = `Expense${userId}/${new Date()}.txt`;
//         const fileUrl = await uploadToS3(stringifiedExpenses,filename);
//         const data = await FileUrl.create({userId:req.user.id,fileUrl:fileUrl});
//         res.status(200).json({fileUrl:fileUrl,success:true});

//     } catch(error){
//         console.log(error);
//         return res.status(500).json({fileUrl:'',error:error,success:false});
//     }
// };

const download = async (req,res,next)=>{
    try{
        const fileUrls = await FileUrl.find({userId:req.user._id});
        res.status(200).json({allFiles:fileUrls,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

// const download = async (req,res,next)=>{
//     try{
//         const fileUrls = await FileUrl.findAll({where:{userId:req.user.id}});
//         res.status(200).json({allFiles:fileUrls,success:true});
//     } catch(error){
//         console.log(JSON.stringify(error));
//         res.status(500).json({message:error,success:false});
//     }
// };

function uploadToS3(data,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

        var params = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('Something went wrong',err);
                    reject(err)
                } else {
                    console.log('success',s3response)
                    resolve(s3response.Location);
                }
            })
        })
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadexpense,
    download,
    getExpenseOnPage2
};