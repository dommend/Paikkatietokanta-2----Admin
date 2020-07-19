const db = require("../models");
const Location = db.locations;
const Op = db.Sequelize.Op;
const paginate = require('jw-paginate');

// Create and Save a new Location
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title, !req.body.coordinateN, !req.body.coordinateE) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Location
  const location = {
    title: req.body.title,
    description: req.body.description,
    coordinateN: req.body.coordinateN,
    coordinateE: req.body.coordinateE,
    markedImportant: req.body.markedImportant,
    videoEmbed: req.body.videoEmbed,
    url: req.body.url,
    flickrTag: req.body.flickrTag,  
    flickrMore: req.body.flickrMore,  
    featuredImage: req.body.featuredImage,
    published: req.body.published
  };

  // Save Location in the database
  Location.create(location)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Location."
      });
    });
};

// Retrieve all Locations from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find all and do pagination
exports.findAllPaged = (req, res, next) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition, order: [ [ 'createdAt', 'DESC' ]] })
    .then(data => {
      const items = data;
      const page = parseInt(req.query.page) || 1;

      // get pager object for specified page
      const pageSize = 12;
      const pager = paginate(items.length, page, pageSize);
  
      // get page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      res.send({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find a single Location with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Location.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Location with id=" + id
      });
    });
};

// Update a Location by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Location.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Location was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Location with id=" + id
      });
    });
};

// Delete a Location with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Location.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Location was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Location with id=${id}. Maybe Location was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Location with id=" + id
      });
    });
};

// Find all markedImportant Location
exports.findAllMarkedImportant = (req, res) => {
  Location.findAll({ where: { markedImportant: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};
