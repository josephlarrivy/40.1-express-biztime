const express = require('express');
const router = new express.Router();
const db = require("../db");
const slugify = require("slugify")

// ###########################


// returns all companies
router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows});
    }
    catch (err) {
        return next(err);
    }
});

// returns company by code
router.get("/:code", async function (req, res, next) {
    let compCode = req.params.code
    try {
        const results = await db.query(`SELECT * FROM companies WHERE code = '${compCode}'`);
        return res.json({ company: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

// posts a compnay
router.post("/", async function (req, res, next) {
    try {
        let { name, description } = req.body;
        let code = slugify(name)
        let result = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)`, [code, name, description]);
        return res.status(201).json({'company': result.rows[0]});
    }
    catch (err) {
        return next(err);
    }
});

// edits an existing company
router.put("/:code", async function (req, res, next) {
    try {
        let compCode = req.params.code
        let { name, description } = req.body;
        let result = await db.query(
            `UPDATE companies SET name=$1, description=$2 WHERE code='${compCode}'`, [name, description]);
        return res.status(201).json(`company ${compCode} updated`);
    }
    catch (err) {
        return next(err);
    }
});

// deletes a company
router.delete("/:code", async function (req, res, next) {
    try {
        let compCode = req.params.code
        const result = await db.query(
            "DELETE FROM companies WHERE code = $1", [compCode]
        );
        return res.json({ message: "Deleted" });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;