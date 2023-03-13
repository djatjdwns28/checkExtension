var express = require('express');
const cors = require('cors');
var router = express.Router();
const app = express()

const whitelist = ['http://localhost:8083/'];
const corsOptions = {
  origin: (origin, callback) => {
    if(whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed Origin!'))
    }
  }
}

app.use(cors(corsOptions));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({hi:'hello'});
});

module.exports = router;
