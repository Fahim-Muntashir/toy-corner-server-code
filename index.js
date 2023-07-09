const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster1.p9ba0ek.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //   finding data
    const toyCategoryData = client.db("carcorner").collection("carcategory");
    const allToyData = client.db("carcorner").collection("alltoydata");
    app.get("/toycategory", async (req, res) => {
      const cursor = toyCategoryData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get with email by data load
    app.get("/alltoy", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await allToyData.find(query).toArray();
      res.send(result);
    });

    // all toy data
    app.post("/alltoy", async (req, res) => {
      const alltoys = req.body;
      const result = await allToyData.insertOne(alltoys);
      res.send(result);
    });
    // alltoy with get
    app.get("/alltoy", async (req, res) => {
      const cursor = allToyData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //specific toy get
    app.get("/alltoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          pictureUrl: 1,
          name: 1,
          sellerName: 1,
          sellerEmail: 1,
          subCategory: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,
        },
      };
      const result = await allToyData.findOne(query, options);
      res.send(result);
    });

    // delete toy
    app.delete("/alltoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToyData.deleteOne(query);
      res.send(result);
    });

    // update a toy

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Is Open NOw");
});

app.listen(port, () => {
  console.log("Toy Car Port Is", port);
});
