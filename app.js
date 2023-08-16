const express = require("express");
const app = express();
const port = 3000;
const turf = require("@turf/turf");
const circos = require("./data/circonscriptions-legislatives.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
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
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
