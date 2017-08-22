// Dependicies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var methodOverride = require("method-override");

//Express
var app = express();

//Port
var PORT = process.env.PORT || 3000;

//Models for DB
var db = require("./models");
// var db = require("./models/index.js");
// var db = require("./models/plates.js");

//Morgan for Logging
app.use(logger("dev"));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// JLD Commented out
// app.use(express.static("public"));

//JLD Test Adds
app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
require("./routes/db-routes.js")(app);

// Starting our express server
// app.listen(PORT, function() {
//     console.log("App listening on PORT: " + PORT);
//   });

  db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

