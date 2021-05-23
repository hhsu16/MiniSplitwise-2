const express = require("express");
const router = express.Router();

router.use("/", require("./auth-routes"));
router.use("/groups", require("./groups"));

router.get("/", (req, res, next) => {
  res.sendFile("../public/index.html");
});

module.exports = router;
