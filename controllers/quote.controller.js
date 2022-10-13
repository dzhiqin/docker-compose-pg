const Fail = require('./tool')

const quotes = require('../services/quotes')

const  getAll = async (req,res,next) => {
  try{
    // res.json(await quotes.getMultiple(req,query.page))
    next(await quotes.getMultiple(req,query.page))
  }catch(err){
    returnErrorRes()
  }
}
const returnResponse = (req,res) => {

}
const returnErrorRes = (err,res) => {
  res.status(err.statusCode || 500).json(new FailRes())
}
module.exports = {
  getAll
}