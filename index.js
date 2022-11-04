const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

//Mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nmcknth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//JWT verify
const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  // console.log(authHeaders);
  if (!authHeaders) {
    return res.status(401).send({ message: "unAuthorized access" });
  }

  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.SECRET, function (error, decoded) {
    if (error) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

const dbConnect = async () => {
  try {
    const serviceCollection = client.db("GeniusCar").collection("services");
    const orderCollection = client.db("GeniusCar").collection("orders");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: "5" });
      res.send({ token });
    });

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

    app.get("/orders", verifyJWT, async (req, res) => {
      const decoded = req.decoded;

      if (decoded.email !== req.query.email) {
        return res.status(403).send({ message: "unauthorized access" });
      }

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
        $set: {
          status: status,
        },
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
