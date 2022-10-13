const express = require('express');
const router = express.Router();
const quotes = require('../services/quotes');
const quotesController = require('../controllers/quote.controller')
class FailRes {
  constructor({msg}){
    this.data=null,
    this.message=msg || 'fail',
    this.resultCode=1
  }
}

router.get('/', async function(req, res, next) {
  try {
    res.json(await quotes.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    res.status(err.statusCode || 500).json(new FailRes({msg: err.message}));
  }
});
/* POST quotes */
router.post('/', async function(req, res, next) {
  try {
    res.json(await quotes.create(req.body));
  } catch (err) {
    console.error(`Error while posting quotes `, err.message);
    res.status(err.statusCode || 500).json(new FailRes({msg: err.message}));
  }
});

router.get('/:id',async function(req,res,next) {
  try{
    res.json(await quotes.findOne(req.params))
  }catch(err) {
    res.status(err.statusCode || 500).json(new FailRes({msg: err.message}));
  }
})
router.post('/:id',async (req,res,next) => {
  try{
    res.json(await quotes.update(parseInt(req.params.id),req.body))
  }catch(err){
    res.status(err.statusCode || 500).json(new FailRes({msg: err.message}));
  }
})
router.delete('/:id',async (req,res,next) => {
  try{
    res.json(await quotes.remove(parseInt(req.params.id),req.body))
  }catch(err){
    res.status(err.statusCode || 500).json(new FailRes({msg: err.message}));
  }
})

module.exports = router;
