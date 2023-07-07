const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Is Open NOw");
});

app.listen(port, () => {
  console.log("Toy Car Port Is", port);
});
