const db = require("../db");
const express = require("express");
const router = express.Router();

//get list of companies should return
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT code, name, description FROM companies`
    );

    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
