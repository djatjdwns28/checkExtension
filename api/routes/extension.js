var express = require('express');
var router = express.Router();
var pool = require('../config/config')


/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const findExtQuery = 'select * from extensions'
    const [result] = await pool.query(findExtQuery)
    res.send(result)
  } catch(error){
    console.log(error)
  }
});

router.put('/:id', async function(req, res) {
  const updateExtensionShowQuery = 'UPDATE extensions SET value = ? WHERE id = ?'
  const connection = await pool.getConnection(async (conn) => conn)

  let result
  try{
    const body = req.body
    const id = req.params.id
    await connection.beginTransaction();
    [result] = await connection.query(updateExtensionShowQuery, [body.value, id]);
    await connection.commit();
  }catch(error){
    res.status(501)
    result = {message:error.message}
    connection.rollback()
    throw error;
  } finally {
    connection.release()
    res.send(result)
  }
}) 

router.post('/add', async function(req, res, next) {
  const addExtensionQuery = 'insert into extensions (name, value) values (?, ?) '
  const checkDuplicate = 'select * from extensions where name = ?'
  const connection = await pool.getConnection(async (conn) => conn)

  try{
    const body = req.body
    await connection.beginTransaction();
    const [result] = await connection.query(checkDuplicate, body.name);
    if(result.length > 0) {
      res.send({duplicate: true, message:'이미 존재하는 데이터 입니다'})
    } else {
      const [data] = await connection.query(addExtensionQuery, [body.name, body.value]);
      res.send({duplicate: false, data}) 
    }
    await connection.commit();
  }catch(error){
    connection.rollback()
    console.log(error)
    throw error
  }finally {
    connection.release()
  }
}) 
router.delete('/delete/all', async function(req, res) {
  const deleteExtensionQuery = 'delete from extensions where fixed = 0'
  try{
    const [result] = await pool.query(deleteExtensionQuery)
    res.json(result)
  }catch(error){
    console.log(error)
    throw error
  }
})
router.delete('/delete/:id', async function(req, res) {
  const id = req.params.id
  const deleteExtensionQuery = 'delete from extensions where id = ?'
  try{
    const [result] = await pool.query(deleteExtensionQuery, [id])
    res.json(result)
  }catch(error){
    console.log(error)
    throw error
  }
})

module.exports = router;
