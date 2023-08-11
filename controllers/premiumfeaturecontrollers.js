const User = require('../models/User');
const Expense = require('../models/Expense');

const getUserLeaderBoard = async (req,res,next) => {
    try{
        // const leaderboardofusers = await User.findAll({
        //     attributes: ['id','username',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group:['user.id'],
        //     order:[['total_cost', 'DESC']]

        // })
        // const leaderboardofusers = await User.find({
        //     order:[['totalExpense', 'DESC']]
        // })
        const leaderboardofusers = await User.find({}).sort({totalExpense:'desc'});

       
        res.status(200).json(leaderboardofusers)
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}