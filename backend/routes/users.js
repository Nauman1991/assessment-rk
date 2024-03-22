var express = require('express');
var router = express.Router();

const { signup, login, uploadImage, update } = require('../controllers/userControllers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/uploadImage', uploadImage);
router.post('/update', update);

module.exports = router;
