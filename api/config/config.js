const mysql = require('mysql2/promise')

var db = mysql.createPool({
    host : '49.247.32.196',
    user: 'root',
    password: 'every1234!',
    port: 3306,
    database: 'flow'
})

module.exports=db