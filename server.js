const express = require('express');
const cors = require('cors'); 
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();
const app = express();
const PORT = process.env.PORT || 8080;

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// POST route
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route
app.get("/api/listings", async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(
      parseInt(page),
      parseInt(perPage),
      name
    );
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route by id
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
    } else {
      res.status(200).json(listing);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route
app.put("/api/listings/:id", async (req, res) => {
  try {
    const updatedListing = await db.updateListingById(
      req.body,
      req.params.id
    );
    if (!updatedListing) {
      res.status(404).json({ error: "Listing not found" });
    } else {
      res.status(200).json(updatedListing);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);
    if (!result) {
      res.status(404).json({ error: "Listing not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Initialize server
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });