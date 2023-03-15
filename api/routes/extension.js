var express = require('express');
var router = express.Router();
var pool = require('../config/config')

/**
 * @const findExtQuery 확장자 전체 리스트 불러오기 쿼리문
 * @const result 확장자 전체 리스트 불러온 결과문 
 */
router.get('/', async function(req, res, next) {
  try {
    const findExtQuery = 'select * from extensions'
    const [result] = await pool.query(findExtQuery)
    res.send(result)
  } catch(error){
    console.log(error)
    throw error
  }
});
/**
 * @const updateExtensionShowQuery 해당 아이디에 속하는 value 값을 업데이트 시키는 용도의 쿼리문
 * @const connection pool에서 커넥션 가져오기 
 * @let result 클라이언트로 보낼 결과물
 * @const body 클라이언트에서 보낸 데이터 
 * @const id 수정할 아이디 값
 */
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
/**
 * @const addExtensionQuery 커스텀 확장자 추가하는 쿼리문
 * @const checkDuplicate 중복 체크를 위해 중복값이 있는지 확인하는 쿼리문
 * @const connection pool에서 커넥션 가져오기 
 * @const body 클라이언트에서 보낸 데이터 
 * @const result 중복 체크 쿼리 결과 데이터
 * @const data 커스텀 확장자 추가 쿼리 결과(추가 아이디 체크하기위해 필요)
 * 
 */
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
      res.send({duplicate: false, id: data.insertId}) 
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

/**
 * @const deleteExtensionQuery 전체 초기화 화기 위한 쿼리 (단 고정 확장자는 안건드림)
 * @const result 쿼리 결과문
 */
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

/**
 * @const id 커스텀 확장자 고유 아이디
 * @const deleteExtensionQuery 해당아이디를 찾아 삭제하는 쿼리문
 * @const result 쿼리 결과물
 */
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
