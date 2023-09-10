const ExpenseSchema = require("../models/ExpenseModel");
const multer = require("multer");
const sharp = require("sharp");


exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date}  = req.body;

       try {
        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        const buffer = await sharp(req.file.buffer).resize({width: 100, heigth: 100}).png().toBuffer();
        const base64String = buffer.toString('base64');
        const income = ExpenseSchema({
            title,
            amount,
            category,
            description,
            date,
            image: base64String
        })
        await income.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        console.log('Error: ', error)
        res.status(500).json({message: 'Server Error'})
    }

}

exports.getExpense = async (req, res) =>{
    try {
        const incomes = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}

exports.upload = multer({
    limits: {
        fileSize : 1000000
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error ('Please upload an image file'))
        }
        cb(undefined, true)
    }
})


