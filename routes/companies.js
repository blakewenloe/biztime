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
    const { code } = req.params;
    const results = await db.query(
      `SELECT code, name, description
      FROM companies
      WHERE code=$1`,
      [code]
    );
    return res.json({ company: results.rows });
  } catch (err) {
    return next(err);
  }
});

//add a company
router.post("/", async function (req, res, next) {
  try {
    const { code, name, description } = req.body;

    const result = await db.query(
      `INSERT INTO companies (code, name, description) 
             VALUES ($1, $2, $3)
             RETURNING code, name, description`,
      [code, name, description]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

//edit a company
router.put("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      `UPDATE companies SET code=$1, name=$2, description=$3 
               WHERE code=$1
               RETURNING code, name, description`,
      [code, name, description]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
