module.exports = app => {
    const phones = require("../controllers/phone.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", phones.create);
  
    // Retrieve all phones
    router.get("/", phones.findAll);
  
    // Retrieve all published phones
    // router.get("/published", phones.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", phones.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", phones.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", phones.delete);
  
    // Create a new Tutorial
    router.delete("/", phones.deleteAll);
  
    app.use('/phones', router);
  };