module.exports = (sequelize, Sequelize) => {
    const Tags = sequelize.define("tags", {
      tagName: {
        type: Sequelize.STRING,
        trim: true
      },
      tagDescription: {
        type: Sequelize.TEXT('long'),
        trim: true
      },
      tagFeaturedImage: {
        type: Sequelize.STRING,
        trim: true
      },
      tagURL: {
        type: Sequelize.STRING,
        trim: true
      },
      tagFeaturedImage: {
        type: Sequelize.STRING,
        trim: true
      },
      tagCoordinateE: {
        type: Sequelize.STRING(15),
        trim: true 
      },
      tagCoordinateN: {
        type: Sequelize.STRING(15),
        trim: true 
      },
    });
    return Tags;
  };