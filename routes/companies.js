const db = require("../db");
const express = require("express");
const router = express.Router();

//get list of companies should return
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT code, name, description FROM companies`
    );

    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

//get a company by its code
router.get("/:code", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT code, name, description
      FROM companies
      WHERE code=$1`,
      [req.params.code]
    );
    return res.json({ company: results.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
