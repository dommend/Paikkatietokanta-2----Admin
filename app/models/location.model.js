module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define("Locations", {
    title: {
      type: Sequelize.STRING,
      trim: true
    },
    description: {
      type: Sequelize.TEXT('long'),
      trim: true
    },
    markedImportant: {
      type: Sequelize.BOOLEAN
    },
    coordinateN: {
      type: Sequelize.STRING(15),
      trim: true  
    },
    coordinateE: {
      type: Sequelize.STRING(15),
      trim: true 
    },
    videoEmbed:  {
      type: Sequelize.STRING,
      trim: true
    },
    url:  {
      type: Sequelize.STRING,
      trim: true
    },
    flickrTag:  {
      type: Sequelize.STRING,
      trim: true
    },
    flickrMore:  {
      type: Sequelize.STRING,
      trim: true
    },
    featuredImage: {
      type: Sequelize.TEXT('long')
    }
  });

  return Location;
};