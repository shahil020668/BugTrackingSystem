// pingRouter.js
const ping = require('../controller/pingController');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Ping Successful');
});

module.exports = router;  // Ensure this is properly exported
