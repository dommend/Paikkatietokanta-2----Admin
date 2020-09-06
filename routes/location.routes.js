module.exports = app => {
  const locations = require ('../controllers/location.controller.js');

  var router = require ('express').Router ();

  // Create a new Location
  router.post ('/', locations.create);

  // Retrieve all Locations
  router.get ('/', locations.findAll);

  // Retrieve all markedImportant Locations
  router.get ('/markedImportant', locations.findAllMarkedImportant);

  // Retrieve all Locations and do pagination
  router.get ('/paged/', locations.findAllPaged);

  // Tag control

  router.post ('/tags/create', locations.createTag);
  router.put ('/update/tag/:id', locations.updateTag);
  router.delete ('/delete/tag/:id', locations.deleteTag);
  router.put ('/delete/removetagfromarticle/:id', locations.removeTagFromArticle);

  router.post ('/tag/addToArticle', locations.addTagToArticle);
  router.get ('/tags/:tagID', locations.findByTagID);
  router.get ('/tags/name/:name', locations.findByTagName);
  router.get ('/tags/', locations.findAllTags);

  // Retrieve a single Location with id
  router.get ('/:id', locations.findOne);
  // Update a Location with id
  router.put ('/:id', locations.update);
  // Delete a Location with id
  router.delete ('/:id', locations.delete);

  app.use ('/api/locations', router);
};
