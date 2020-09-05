const db = require("../models");
const Location = db.locations;
const Tag = db.tags;
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

  Location.findAll({
    include: [
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "tagName"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while retrieving locations: ", err);
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
  return Location.findByPk(id, {
    include: [
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "tagName"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding location: ", err);
    });
};

exports.findByTagID = (req, res) => {
  const tag = req.params.tagID;
  return Tag.findByPk(tag, {
    include: [
      {
        model: Location,
        as: "locations",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding location tag: ", err);
    });
};

exports.findByTagName = (req, res) => {
  const tag = req.params.tagName;
  return Tag.findAll(tag, {
    include: [
      {
        model: Location,
        as: "locations",
        attributes: ["id", "title"],
        through: {
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding tag: ", err);
    });
};

exports.findAllTags = (req, res) => {
  Tag.findAll({
    // include: [
    //   {
    //     model: Location,
    //     as: "locations",
    //     attributes: ["id", "title"],
    //     through: {
    //       attributes: [],
    //     },
    //   },
    // ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while retrieving tags: ", err);
    });
};


exports.updateTag = (req, res) => {
  const id = req.params.id;

  Tag.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tag was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update tag with id=${id}. Maybe tag was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating tag with id=" + id
      });
    });
};


exports.deleteTag = (req, res) => {
  const id = req.params.id;

  Tag.destroy(
    {
      where: { id: id },
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tag was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tag with id=${id}. Maybe tag was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete tag with id=" + id
      });
    });
}


exports.addTagToArticle = (req, res) => {
  return Tag.findByPk(req.body.tagID)
    .then((tag) => {
      if (!tag) {
        console.log("Tag not found!");
        return null;
      }
      return Location.findByPk(req.body.locationID).then((location) => {
        if (!location) {
          console.log("Tag not found!");
          return null;
        }

        tag.addLocation(location);
        res.send('Tunniste ja paikka yhdistetty')
        console.log(`>> added location id=${location.id} to tag id=${location.id}`);
        return tag;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding location to tag: ", err);
    });
};

exports.removeTagFromArticle = (req, res) => {
  const tagID = req.params.id;
  const locationID = req.body.data;

  return Tag.findByPk(tagID)
    .then((tag) => {
      if (!tag) {
        console.log("Tag not found!");
        return null;
      }
      return Location.findByPk(locationID).then((location) => {
        if (!location) {
          console.log("tag not found!");
          return null;
        }
        tag.removeLocation(location);
        console.log(`>> Deleted location id=${location.id} from tag id=${location.id}`);
        return tag;
      });
    })
    .catch((err) => {
      console.log(">> Error while removing location to tag: ", err);
    });
};


exports.createTag = (req, res) => {
  const locationTag = {
   tagName: req.body.name,
   tagDescription: req.body.description,
   tagFeaturedImage: req.body.featuredImage}
   Tag.findAndCountAll({
    where: {
      tagName: {
        [Op.like]: req.body.name
      }
    }
  })
    .then(result => {
      if (result.count != '') {
        res.send("Avainsana on jo olemassa.");
      } else if (req.body.name.replace(/^\s+|\s+$/gm,'').length == 0) {
        res.send("Avainsana ei voi olla tyhjä.");
      }
      else {
        Tag.create(locationTag)
        res.send("Avainsana luotiin.")}
    }).catch(err => {
      res.status(500).send("Avainsanan luomisessa tapahtui virhe:" + err) } 
    );
}


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
