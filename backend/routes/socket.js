var express = require('express');
var router = express.Router();

const { message } = require('../controllers/socketControllers')

router.post('/message', message);

module.exports = router;