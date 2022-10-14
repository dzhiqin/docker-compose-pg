const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, quote, author FROM quote OFFSET $1 LIMIT $2', 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }  
}
async function getQuotesByPage(req) {
  let {page = 1,pageSize = 10} = req.query
  page=parseInt(page)
  pageSize=parseInt(pageSize)
  const offset = helper.getOffset(page, pageSize)
  const countRes = await db.query('SELECT COUNT(*) FROM quote')
  const total = parseInt(countRes.rows[0].count)
  const result = await db.query(
    'SELECT id, quote, author FROM quote OFFSET $1 LIMIT $2',
    [offset, pageSize]
  )
  const data = {
    list: helper.emptyOrRows(result.rows),
    page,
    pageSize,
    total
  }
  return data
}

function validateCreate(quote) {
  let messages = [];

  console.log(quote);

  if (!quote) {
    messages.push('No object is provided');
  }

  if (!quote.quote) {
    messages.push('Quote is empty');
  }

  if (!quote.author) {
    messages.push('Author is empty');
  }

  if (quote.quote && quote.quote.length > 255) {
    messages.push('Quote cannot be longer than 255 characters');
  }

  if (quote.author && quote.author.length > 255) {
    messages.push('Author name cannot be longer than 255 characters');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;
    throw error;
  }
}
function normalizeValue(value) {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
}
async function create(req){
  const {body} = req
  validateCreate(body);
  // const result = await db.query(
  //   'INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *',
  //   [quote.quote, quote.author]
  // );
  const assigns = Object.keys(body);
  const values = Object.values(body).map((value) => normalizeValue(value));
  const result = await db.query(
    `INSERT INTO quote (${assigns}) VALUES (${values})`
  )
  return result.rows
}
async function findOneById(req){
  const {params:{id}} = req
  const res = await db.query(
    'select * from quote where id=$1',
    [id]
  )
  if(!res.rows.length){
    let error = new Error('quote does not exit')
    error.statusCode = 400
    throw error
  }
  return res.rows[0]
  
}
async function updateById(req){
  // const result = await db.query(
  //   'UPDATE quote SET quote=$1, author=$2 WHERE id=$3',
  //   [quote,author,id]
  // )
  // const item = await db.query
  const {params:{id},body} = req
  const assigns = Object.keys(body)
  const values = assigns.map((key) => `${key}=${normalizeValue(body[key])}`).join(', ');
  const result = await db.query(
    `UPDATE quote SET ${values} WHERE id=${id}`
  )
  return result.rows
}
async function deleteById(req) {
  const {params: {id}} = req
  const result = await db.query(
    'DELETE FROM quote WHERE id=$1',[id]
  )
  return result.rows
}
module.exports = {
  getMultiple,
  create,
  findOneById,
  updateById,
  deleteById,
  getQuotesByPage
}
