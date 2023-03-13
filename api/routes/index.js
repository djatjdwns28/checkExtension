var express = require('express');
var cors = require('cors');
var router = express.Router();
const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json())


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({hi:'hello'});
});

module.exports = router;
