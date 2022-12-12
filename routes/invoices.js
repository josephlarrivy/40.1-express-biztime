const express = require('express');
const router = new express.Router();
const db = require("../db");

// ###########################


// returns all invoices
router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

// returns invoice by code
router.get("/:code", async function (req, res, next) {
    let compCode = req.params.code
    try {
        const results = await db.query(`SELECT * FROM invoices WHERE comp_Code = '${compCode}'`);
        return res.json({ company: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

// posts an invoice
router.post("/", async function (req, res, next) {
    try {
        // let add_date = Date.now()
        let { comp_code, amt } = req.body;
        let result = await db.query(
            `INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES ($1, $2, $3, $4)`, [comp_code, amt, false, null]);
        return res.status(201).json({ "invoice": result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

// edits an existing invoice
router.put("/:id", async function (req, res, next) {
    try {
        let inv_id = req.params.id
        let { amt, paid } = req.body;
        console.log(amt)
        console.log(paid)
        let paid_date = null;
        let get_invoice = await db.query(`SELECT * FROM invoices WHERE id = '${inv_id}'`)
        let current_status = get_invoice.rows[0].paid_date
        console.log(current_status)

        if (paid === true) {
            paid_date = new Date();
        // } else if (paid !== false) {
            // paid_date = null;
        } else {
            paid_date = current_status;
        }
        let result = await db.query(
            `UPDATE invoices SET amt=$1 paid=$2 paid_date=$3 WHERE id='${inv_id}'`, [0, paid, paid_date]);
        return res.status(201).json({ "invoice updated": result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

// deletes an invoice
router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id
        const result = await db.query(
            "DELETE FROM invoices WHERE id = $1", [id]
        ); 
        return res.json({ message: "Deleted" });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;