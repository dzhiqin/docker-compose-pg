const {FailRes} = require('../libs/index')
const quotes = require('../services/quotes')

const returnError = (res,err) => {
  res.status(err.statusCode || 500).json(new FailRes({message: err+''}))
}
const  getQuotes = async (req,res,next) => {
  try{
    const result = await quotes.getQuotesByPage(req)
    res.data = result
    next()
  }catch(err){
    returnError(res,err)
  }
}
const getQuote = async (req,res,next) => {
  try{
    const result = await quotes.findOneById(req)
    res.data = result
    next()
  }catch(err){
    returnError(res,err)
  }
}
const updateQuote = async (req,res,next) => {
  try{
    const result = await quotes.updateById(req)
    res.data = result
    next()
  }catch(err){  
    returnError(res,err)
  }
}
const deleteQuote = async (req,res,next) => {
  try{
    const result = await quotes.deleteById(req)
    res.data = result
    next()
  }catch(err){
    returnError(res,err)
  }
}
const createQuote = async (req,res,next) => {
  try{
    const result = await quotes.create(req)
    res.data = result
    next()
  }catch(err){
    returnError(res,err)
  }
}
module.exports = {
  getQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
  createQuote
}