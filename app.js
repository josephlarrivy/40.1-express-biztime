/** BizTime express application. */


const express = require("express");
const server = require('./server')
const app = express();
const ExpressError = require("./expressError")

app.use(express.json());







// this might not be what I need
const companyRoutes = require("./routes/companies");
app.use("/companies", companyRoutes);

const invoicesRoutes = require("./routes/invoices");
app.use("/invoices", invoicesRoutes);
// this might not be what I need






/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});




// move this back to server.js when you figure out what's wrong with that file
app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
// move this back to server.js when you figure out what's wrong with that file





module.exports = app;