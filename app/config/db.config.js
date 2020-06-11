module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "paikkatietokanta",
  dialect: "mysql",
  dialectOptions: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
