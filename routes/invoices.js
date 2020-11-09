const db = require("../db");
const express = require("express");
const router = express.Router();

//get list of invoices
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
      FROM invoices`
    );

    return res.json({ invoices: results.rows });
  } catch (err) {
    return next(err);
  }
});

//get a invoice by its id
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
        FROM invoices
        WHERE id=$1`,
      [id]
    );
    return res.json({ invoice: results.rows });
  } catch (err) {
    return next(err);
  }
});

//add a invoice
router.post("/", async function (req, res, next) {
  try {
    const { comp_code, amt, paid, add_date, paid_date } = req.body;

    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) 
             VALUES ($1, $2, $3, $4, $5)
             RETURNING comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt, paid, add_date, paid_date]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

//edit a invoice
router.put("/:id", async function (req, res, next) {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      `UPDATE invoices SET code=$1, name=$2, description=$3 
               WHERE code=$1
               RETURNING code, name, description`,
      [code, name, description]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

//delete a invoice
router.delete("/:id", async function (req, res, next) {
  try {
    const { code } = req.params;
    const result = await db.query("DELETE FROM invoices WHERE code = $1", [
      code,
    ]);

    return res.json({ message: "invoice deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
