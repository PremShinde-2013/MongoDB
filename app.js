const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb, connectToDb } = require("./db");

// init app & middleware
const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen("3000", () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes
app.get("/anime-list", (req, res) => {
  // current Page
  const pages = req.query.p || 0;
  const animePerPage = 8;

  let animes = [];

  db.collection("anime-list")
    .find()
    .sort({ author: 1 })
    .skip(pages * animePerPage)
    .limit(animePerPage)
    .forEach((anime) => animes.push(anime))
    .then(() => {
      res.status(200).json(animes);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

app.get("/anime-list/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("anime-list")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the data" });
      });
  } else {
    res.status(500).json({ error: "not valid document id" });
  }
});

app.post("/anime-list", (req, res) => {
  const anime = req.body;

  db.collection("anime-list")
    .insertOne(anime)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});

app.delete("/anime-list/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("anime-list")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the data" });
      });
  } else {
    res.status(500).json({ error: "not valid document id" });
  }
});

app.patch("/anime-list/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("anime-list")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update the data" });
      });
  } else {
    res.status(500).json({ error: "not valid document id" });
  }
});
