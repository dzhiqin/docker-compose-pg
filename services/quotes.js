const db = require('./db');
const helper = require('../helper');
const config = require('../config');

class SuccessRes {
  constructor({data}){
    this.data=data || null,
    this.message='success',
    this.resultCode=0
  }
}
class FailRes {
  constructor({msg}){
    this.data=null,
    this.message=msg || 'fail',
    this.resultCode=1
  }
}
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
async function create(body){
  validateCreate(body);

  // const result = await db.query(
  //   'INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *',
  //   [quote.quote, quote.author]
  // );

  const assigns = Object.keys(body);
  const values = Object.values(body).map((value) => normalizeValue(value));
  console.log('values',values);
  
  const result = await db.query(
    `INSERT INTO quote (${assigns}) VALUES (${values})`
  )
  console.log('create result',result);
  return new SuccessRes({})
}
async function findOne(body){
  const res = await db.query(
    'select * from quote where id=$1',
    [body.id]
  )
  console.log('find one',res);
  
  const data = helper.emptyOrRows(res.rows)
  // const data = helper.emptyOrRows(rows);
  return new SuccessRes({data})
}
async function update(id,body){
  // const result = await db.query(
  //   'UPDATE quote SET quote=$1, author=$2 WHERE id=$3',
  //   [quote,author,id]
  // )
  // const item = await db.query
  const assigns = Object.keys(body)
  const values = assigns.map((key) => `${key}=${normalizeValue(body[key])}`).join(', ');
  const result = await db.query(
    `UPDATE quote SET ${values} WHERE id=${id}`
  )
  if(result.rowCount == 0){
     return new FailRes({msg:'no record'})
  }else{
    return new SuccessRes({})
  }
}
async function remove(id) {
  const result = await db.query(
    'DELETE FROM quote WHERE id=$1',[id]
  )
  if(result.rowCount === 0){
    return new FailRes({msg: 'record not find'})
  }
  return new SuccessRes({})
}
module.exports = {
  getMultiple,
  create,
  findOne,
  update,
  remove
}
