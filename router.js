const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('server in running');
})

module.exports = router;