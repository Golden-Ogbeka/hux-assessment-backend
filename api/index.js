const express = require('express');
const v1 = require('./v1/routes');

const router = express.Router();

router.use('/v1', v1);

module.exports = router;
