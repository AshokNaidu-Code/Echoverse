// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post("https://echoverse-backend-suq1.onrender.com/api/entry", async (req, res) => {
  const { name, email } = req.body;
  console.log('📝 Incoming entry:', name, email); 
  if (!name || !email)
    return res.status(400).json({ message: "Missing fields" });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("echoverse"); // Uses DB name from URI
    const collection = db.collection("visitors");
    await collection.insertOne({
      name,
      email,
      entrySource: "index",
      timestamp: new Date(),
    });
    res.status(200).json({ message: "Entry stored" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
