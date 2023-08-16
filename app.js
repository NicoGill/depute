const express = require("express");
const app = express();
const turf = require("@turf/turf");
const cors = require('cors');
const circos = require("./data/circonscriptions-legislatives.json");

app.use(cors())

app.use(express.json({extended: false}));

app.get("/", (req, res) => {
  res.send("Test de Express.js pour API.!");
});

app.post("/", (req, res) => {
  const coord = req.body;
  const point = turf.point([coord.lat, coord.long]);
  let result = null;

  try {
    circos.features.forEach((f) => {
      let poly = turf.polygon(f.geometry.coordinates);
      let find = turf.booleanPointInPolygon(point, poly);

      if (find) {
        result = f.properties.REF;
      }
    });
  } catch (err) {
    console.log(err);
  }
  res.json({ data: result });
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export the Express API
module.exports = app;