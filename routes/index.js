var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/compress", function (req, res, next) {
  res.send({ statusCode: 200 });
});

module.exports = router;
