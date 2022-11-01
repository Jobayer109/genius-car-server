const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nmcknth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
    try {
        const servicesCollection = client.db("GeniusDB").collection("services")
        
    }
    finally {
        
    }
};
dbConnect().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Genius server is running");
});

app.listen(port, () => {
  console.log(`Genius server is running on port:${port}`);
});
