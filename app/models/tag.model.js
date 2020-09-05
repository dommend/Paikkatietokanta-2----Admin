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
    });
    return Tags;
  };