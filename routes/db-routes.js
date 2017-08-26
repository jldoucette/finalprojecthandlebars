var db = require("../models");
var bcrypt = require("bcryptjs");
const saltRounds = 10;
// var siteUsername;

module.exports = function (app) {
  var userLoggedIn = false;
  var userIdentity;
  var userFirstName;
  var userLastName;
  var userAddress;
  var usereMail;
  var userPhone;
  var userRestaurant;
  var userRole;
  var password;
  var today;
  var todaysdate;
  var siteUsername;

  app.get("/", function (req, res) {
    res.render("login");
  });

  app.get("/home", function (req, res) {
    res.render("index");
  });
  app.get("/logout", function (req, res) {
    userLoggedIn = false;
    res.redirect("/login");

  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.put("/login", function (req, res) {
    console.log("^^^^^^^^^^^^^^^^Got to Login Put");
    today = new Date();
    todaysdate = today.getFullYear() + "-" + (1 + today.getMonth()) + "-" + today.getDate();
    console.log("++++++++++++++++++++++++++Todays Date is " + todaysdate);
    db.guests.findOne({
      where:
      {
        username: req.body.username
      }
    }).then(project => {
      // }).then(function(data){

      if (project != null) {
        //project is the body of the object that is returned if the user exists
        bcrypt.compare(req.body.password, project.dataValues.password, function (err, matches) {
          if (err) {
            console.log('Error while checking password');
          }
          else if (matches) {
            console.log('The password matches!');
            siteUsername = req.body.username;
            db.guests.findOne({
              where: {
                username: siteUsername
              }
            }).then(function (data) {
              console.log("Password was matched");
              console.log("User"+siteUsername);
              console.log(data.id);
              console.log(data.first_name);
              console.log(data.last_name);
              console.log(data.address);
              console.log(data.email);
              console.log(data.phone);
              console.log(data.restaurantID);
              console.log(data.user_role);
              userLoggedIn = true;
              userIdentity = data.id;
              userFirstName = data.first_name;
              userLastName = data.last_name;
              userAddress = data.address;
              usereMail = data.email;
              userPhone = data.phone;
              userRestaurant = data.restID;
              userRole = data.user_role;

              if (userRole == "R") {
                console.log("User Role was R");
                res.redirect("/pendingorders");
              }
              if (userRole == "U") {
                res.redirect("/purchaseoptions");
              }
              if (userRole == "A") {
                res.redirect("/admin");
              }
            });
          }

          else if (!matches) {
            userLoggedIn = false;
            console.log('The password does NOT match!');
            res.render("nologinerror");
          }
        });
      }
      else {
        userLoggedIn = false;
        res.render("nologinerror");
      }
    });
  });

  app.get("/newuser", function (req, res) {
    res.render("newuser");
  });



  app.post("/newuser", function (req, res) {
    var AlteredPassword = req.body.password;
    bcrypt.hash(AlteredPassword, saltRounds, function (err, hash) { //bcrypt encrypts the password
      db.guests.create({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hash,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.username,
        user_role: req.body.user_role,
        restID: req.body.rest_id

      }).then(function (dbTodo) {
        console.log('redirecting');
        res.redirect("/login");

      })
    })
  });

  app.get("/plates", function (req, res) {
    if (userLoggedIn && userRole == "R") {
      db.plates.findAll({
        order: ['plate_name'],
        where: { quantity: { $gt: 0 } }
      }).then(function (data) {
        var hbsObject = {
          plates: data
        };
        res.render("plates", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });


  app.post("/addplate", function (req, res) {
    if (userLoggedIn && userRole == "R") {
      console.log(req.body);
      var postdate = new Date();
      var createDate = postdate.getFullYear() + "-" + (1 + postdate.getMonth()) + "-" + postdate.getDate();
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Create Date: " + createDate);
      db.plates.create({
        plate_name: req.body.plate_name,
        protein: req.body.protein,
        side1: req.body.side1,
        side2: req.body.side2,
        side3: req.body.side3,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        createdby: req.body.createdby,
        createdate: createDate,
        preptime: req.body.preptime,
        delaytime: req.body.delaytime,
        restaurantId: userRestaurant
        // GuestID:userIdentity
      }).then(function (data) {
        res.redirect("/plates");
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get('/pendingorders', function (req, res) {
    if (userLoggedIn && userRole == "R") {
      db.purchases.findAll({
        order: [['createdAt', 'ASC']],
        where: {
          'restaurantId': userRestaurant,
          paid: true,
          completed: false
        },
        include: [db.guests, db.plates]
      }).then(function (data) {
        console.log("^^^^^^^^^^^^^^**********Plate DB Retrieve" + JSON.stringify(data));
        // console.log("*****Testing Ref to Plates"+data[0].plates.protein);
        var hbsObject = {
          pendingorders: data
        };
        res.render("pendingorders", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get('/purchaseoptions', function (req, res) {
    if (userLoggedIn && userRole == "U") {
      db.plates.findAll({
        //  order: [['restID', 'ASC']],
        where: {
          'quantity': { $gte: 1 },
          createdate: todaysdate
        }

      }).then(function (data) {
        var hbsObject = {
          purchaseoptions: data
        };
        res.render("purchaseoptions", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.put("/purchaseoptions/:id", function (req, res) {
    if (userLoggedIn && userRole == "U") {
      console.log(req.body);
      console.log("Body Quantity " + req.body.quantityordered);
      var newQuantity = parseInt(req.body.priorquantity) - parseInt(req.body.quantityordered);
      console.log("New Quantity " + newQuantity);
      if (newQuantity >= 0) {
        db.purchases.create({
          guestId: userIdentity,
          quantity: req.body.quantityordered,
          restaurantId: req.body.restID,
          plateId: req.params.id,
          paid: false,
          completed: false
        }), db.plates.update({
          quantity: newQuantity
        }, {
            where: {
              id: req.params.id
            }
          }).then(function (data) {
            // var hbsObject = {
            //   purchasesummary: data
            // };
            res.render("purchaseoptions");
          });
      }
      else {
        console.log("******NOT ENOUGH LEFT*********");
        res.redirect("/notenoughtosell");
      }
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get('/purchasesummary', function (req, res) {
    if (userLoggedIn && userRole == "U") {
      console.log("%%%%%%%GOT HERE to purchases summary");
      db.purchases.findAll({
        order: [['restaurantId', 'ASC']],
        where: {
          guestId: userIdentity,
          paid: false,
          'quantity': { $gte: 1 }
        },
        include: [db.plates, db.restaurants]

      }).then(function (data) {
        console.log("%%%%%%%%%%%%%%Data Result" + JSON.stringify(data));
        var hbsObject = {
          purchasesummary: data
        };
        res.render("purchasesummary", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.put("/purchaseplates/:id", function (req, res) {
    if (userLoggedIn && userRole == "U") {
      console.log(req.body);

      db.purchases.update({
        paid: true
      }, {
          where: {
            id: req.params.id
          }
        }).then(function (data) {
          res.redirect("/purchaseoptions");
        });

    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.put("/completeplate/:id", function (req, res) {
    if (userLoggedIn && userRole == "R") {
      console.log(req.body);

      db.purchases.update({
        completed: true
      }, {
          where: {
            id: req.params.id
          }
        }).then(function (data) {
          res.redirect("/pendingorders");
        });

    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get("/restaurants", function (req, res) {
    if (userLoggedIn && userRole == "A") {
      db.restaurants.findAll({
        order: ['restname']
      }).then(function (data) {
        var hbsObject = {
          restaurants: data
        };
        res.render("restaurants", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });


  app.post("/addrestaurant", function (req, res) {
    if (userLoggedIn && userRole == "A") {
      console.log(req.body);
      db.restaurants.create({
        restname: req.body.restname,
        address: req.body.address,
        hours: req.body.hours,
        phone: req.body.phone,
        email: req.body.email,
        createdBy: siteUsername
      }).then(function (data) {
        res.redirect("/restaurants");
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get('/admin', function (req, res) {
    if (userLoggedIn && userRole == "A") {
      db.guests.findAll({
        order: [
          ['user_role', 'ASC'],
          ["last_name", "ASC"]
        ]
      }).then(function (data) {
        var hbsObject = {
          allguests: data
        };
        res.render("adminguests", hbsObject);
      });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.put("/updateguest/:id", function (req, res) {
    if (userLoggedIn && userRole == "A") {
      console.log(req.body);
      db.guests.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        phone: req.body.phone,
        username: req.body.username,
        email: req.body.username,
        restID: req.body.restID,
        user_role: req.body.user_role,
      }, {
          where: {
            id: req.params.id
          }
        }).then(function (data) {
          res.redirect("/admin");
        });
    }
    else {
      console.log("failed if, no username");
      res.render("nologinerror");
    }
  });

  app.get('/notenoughtosell', function (req, res) {
    if (userLoggedIn && userRole == "U") {
      res.render("notenoughtosell");
    }
    else {
      console.log("******NOT ENOUGH LEFT*********");
      res.redirect("/notenoughtosell");
    }
  });

} 
