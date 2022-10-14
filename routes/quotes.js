const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quote.controller')
const {SuccessRes} = require('../libs/index')
const returnSuccess = (req,res) => {
  res.json(new SuccessRes({data:res.data}))
}

router.route('/')
  .get(quotesController.getQuotes,returnSuccess)
  .post(quotesController.createQuote,returnSuccess)
router.route('/:id')
  .all(quotesController.getQuote)
  .get(returnSuccess)
  .post(quotesController.updateQuote,returnSuccess)
  .delete(quotesController.deleteQuote,returnSuccess)

module.exports = router;
