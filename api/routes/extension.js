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
  const updateExtensionShowQuery = 'UPDATE extensions SET `show` = ? WHERE id = ?'
  const connection = await pool.getConnection(async (conn) => conn)

  let result
  try{
    const body = req.body
    const id = req.params.id
    await connection.beginTransaction();
    [result] = await connection.query(updateExtensionShowQuery, [body.show, id]);
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

router.post('/add', async function(req, res) {
  const addExtensionQuery = 'insert into extensions (name, `show`) values (?, ?) '
  const connection = await pool.getConnection(async (conn) => conn)

  let result
  try{
    const body = req.body
    await connection.beginTransaction();
    [result] = await connection.query(addExtensionQuery, [body.name, body.show]);
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
