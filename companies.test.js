// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("./app");
const db = require("./db");

// ################################

let testCompany;

beforeEach(async function () {
    let result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('tst', 'test_comp', 'test description') RETURNING id, code, name, description`);
    testCompany = result.rows[0];
});

afterEach(async function () {
    // delete any data created by test
    await db.query("DELETE FROM companies");
});

afterAll(async function () {
    // close db connection
    await db.end();
});

// ################################

describe("GET /companies", function () {
    test("Gets all companies", async function () {
        const response = await request(app).get(`/companies/`);
        expect(response.statusCode).toEqual(200);
    });
    test("Gets company by code", async function () {
        const response = await request(app).get(`/companies/apple`);
        expect(response.statusCode).toEqual(200);
    });
});

describe("GET /invoices", function () {
    test("Gets all invoices", async function () {
        const response = await request(app).get(`/invoices/`);
        expect(response.statusCode).toEqual(200);
    });
    test("Gets invoice by id", async function () {
        const response = await request(app).get(`/invoices/2`);
        expect(response.statusCode).toEqual(200);
    });
});