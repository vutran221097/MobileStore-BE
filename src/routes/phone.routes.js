const {
  authJwt
} = require("../middlewares");
const PhoneController = require("../controllers/phone.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/phones",
    PhoneController.findAll,
    PhoneController.findOne
  );

  app.get(
    "/phones",
    [authJwt.verifyToken, authJwt.isModerator],
    PhoneController.create,
    PhoneController.deleteAll
  );

  app.get(
    "/phones/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    PhoneController.update,
    PhoneController.delete
  );
};


// module.exports = app => {
//     const phones = require("../controllers/phone.controller.js");
  
//     var router = require("express").Router();
  
//     // Create a new phone
//     router.post("/", phones.create);
  
//     // Retrieve all phone
//     router.get("/", phones.findAll);
  
//     // Retrieve a single phone with id
//     router.get("/:id", phones.findOne);
  
//     // Update a phone with id
//     router.put("/:id", phones.update);
  
//     // Delete a phone with id
//     router.delete("/:id", phones.delete);
  
//     // Create a new phone
//     router.delete("/", phones.deleteAll);
  
//     app.use('/phones', router);
//   };