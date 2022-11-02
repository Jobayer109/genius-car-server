const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nmcknth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    const serviceCollection = client.db("GeniusCar").collection("services");
    const orderCollection = client.db("GeniusCar").collection("orders");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //order api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = { email: req.query.email };
      }

      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const status = req.body.status;
      const updateDoc = {
        $set:{
          status: status
        }
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Genius server is running");
});

app.listen(port, () => {
  console.log(`Genius server is running on port:${port}`);
});
