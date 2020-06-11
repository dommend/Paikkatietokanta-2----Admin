module.exports = app => {
  const locations = require("../controllers/location.controller.js");

  var router = require("express").Router();

  // Create a new Location
  router.post("/", locations.create);

  // Retrieve all Locations
  router.get("/", locations.findAll);

  // Retrieve all markedImportant Locations
  router.get("/markedImportant", locations.findAllMarkedImportant);

  // Retrieve all Locations and do pagination
  router.get("/paged/", locations.findAllPaged);

  // Retrieve a single Location with id
  router.get("/:id", locations.findOne);

  // Update a Location with id
  router.put("/:id", locations.update);

  // Delete a Location with id
  router.delete("/:id", locations.delete);

  app.use('/api/locations', router);

};
