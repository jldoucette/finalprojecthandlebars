var db = require("../models");

module.exports = function(app) {
var userLoggedIn;
var userIdentity;
var userFirstName;
var userLastName;
var userAddress;
var usereMail;
var userPhone;
var userRestaurant;
var userRole;
var password;

app.get("/login", function(req, res) {
         res.render("login");
        });

  app.put("/login", function(req, res){
      console.log("^^^^^^^^^^^^^^^^Got to Login Put");
     
    db.guests.findOne({
     where: 
    {username: req.body.username
    }
    }).then(function(data){
        console.log("Data found" +data);
        if(data){
            if(data.password==req.body.password){
                console.log("Password was matched");
                console.log(data.id);
                console.log(data.first_name);
                console.log(data.last_name);
                console.log(data.address);
                console.log(data.email);
                console.log(data.phone);
                console.log(data.restaurantID);
                console.log(data.user_role);
            userLoggedIn=true;
            userIdentity=data.id;
            userFirstName=data.first_name;
            userLastName=data.last_name;
            userAddress=data.address;
            usereMail=data.email;
            userPhone=data.phone;
            userRestaurant=data.restaurantID;
            userRole=data.user_role;
            if(userRole=="R"){
            res.render("pendingorders");
            }
            else {
                res.render("purchaseoptions");
            } 
            }
            else {
            res.render("nologinerror");  
            }
        }
        else {
            res.render("nologinerror");
        }
    })
  });  

  app.get("/", function(req, res) {
    if (userLoggedIn && userRole=="R") {
    db.plates.findAll({
       order: ['plate_name']
    }).then(function(data) {
        var hbsObject = {
      plates: data
    };
     res.render("index", hbsObject);
    });
}
    else {
        console.log("failed if, no username");
        res.render("nologinerror");
         } 
});

  
  app.post("/", function(req, res) {
    if (userLoggedIn && userRole=="R") {
    console.log(req.body);
    var postdate=new Date();
    var createDate=postdate.getFullYear()+"-"+(1+postdate.getMonth())+"-"+postdate.getDate();
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Create Date: "+createDate);
    db.plates.create({
      plate_name: req.body.plate_name,
      protein: req.body.protein,
      side1:req.body.side1,
      side2:req.body.side2,
      side3:req.body.side3,
      price:req.body.price,
      quantity:req.body.quantity,
      description:req.body.description,
      createdby:req.body.createdby,
      createdate:createDate,
      preptime:req.body.preptime,
      delaytime:req.body.delaytime,
      restID:req.body.restID
    }).then(function(data) {
      res.redirect("/");
    });
}
else {
    console.log("failed if, no username");
    res.render("nologinerror");
     } 
  });  

  app.get('/pendingorders', function(req, res) {
    if (userLoggedIn && userRole=="R") {
  db.purchases.findAll({
     order: [['createdAt', 'ASC']],
where: {
    'restID':'1'
},
include: [db.Plates]
}).then(function(data) {
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

app.get('/purchaseoptions', function(req, res) {
    if (userLoggedIn && userRole=="U") {
    var today=new Date();
    var todaysdate=today.getFullYear()+"-"+(1+today.getMonth())+"-"+today.getDate();
    console.log("++++++++++++++++++++++++++Todays Date is "+todaysdate);
    db.plates.findAll({
       order: [['restID', 'ASC']],
  where: {
      'quantity':{$gte: 1},
      createdate:todaysdate
     }
      
  }).then(function(data) {
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

app.put("/purchaseoptions/:id", function(req, res) {
    if (userLoggedIn && userRole=="U") {
    console.log(req.body);
    console.log("Body Quantity "+req.body.quantityordered);
    var newQuantity=parseInt(req.body.priorquantity)-parseInt(req.body.quantityordered);
    console.log("New Quantity "+ newQuantity);
    if (newQuantity>0) {
    db.purchases.create({
      purchaserID: '1',

      quantity:newQuantity,
      restID:req.body.restID
    }),db.plates.update({
        quantity:newQuantity
    },{
      where: {
        id:req.params.id
      }
    }).then(function(data) {
      res.redirect("/purchaseoptions");
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

  app.get('/notenoughtosell', function(req, res) {
    if (userLoggedIn && userRole=="U") {
     res.render("notenoughtosell");   
  }
  else {
    console.log("******NOT ENOUGH LEFT*********");
    res.redirect("/notenoughtosell");
}
  });

} 
