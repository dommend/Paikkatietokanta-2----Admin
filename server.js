const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Enable Cors
var corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8081', 'https://admin.paikkatietokanta.net', 'https://www.admin.paikkatietokanta.net']
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

const db = require("./app/models");
db.sequelize.sync();

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello there!" });
});

require("./app/routes/location.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});