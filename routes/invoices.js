const db = require("../db");
const express = require("express");
const router = express.Router();

//get list of invoices
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT id, comp_Code
      FROM invoices`
    );

    return res.json({ invoices: results.rows });
  } catch (err) {
    return next(err);
  }
});

//get an invoice by its id
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT i.id, 
              i.comp_code, 
              i.amt, 
              i.paid, 
              i.add_date, 
              i.paid_date, 
              c.name, 
              c.description 
       FROM invoices AS i
         INNER JOIN companies AS c ON (i.comp_code = c.code)  
       WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404);
    }
    return res.json({ invoice: results.rows });
  } catch (err) {
    return next(err);
  }
});

//add an invoice
router.post("/", async function (req, res, next) {
  try {
    const { comp_Code, amt, paid, add_date, paid_date } = req.body;

    const result = await db.query(
      `INSERT INTO invoices (comp_Code, amt, paid, add_date, paid_date) 
             VALUES ($1, $2, $3, $4, $5)
             RETURNING comp_Code, amt, paid, add_date, paid_date`,
      [comp_Code, amt, paid, add_date, paid_date]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

//edit an invoice
router.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { comp_Code, amt, paid, add_date, paid_date } = req.body;

    const result = await db.query(
      `UPDATE invoices SET comp_code=$2, amt=$3, paid=$4, add_date=$5, paid_date=$6
               WHERE id=$1
               RETURNING id, comp_Code, amt, paid, add_date, paid_date`,
      [id, comp_Code, amt, paid, add_date, paid_date]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

//delete a invoice
router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM invoices WHERE id = $1", [id]);

    return res.json({ message: "invoice deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
