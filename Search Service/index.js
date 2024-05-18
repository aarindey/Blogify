const express = require("express");
const algoliasearch = require("algoliasearch");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3009;

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex("blogs_store");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post("/savepost", (req, res) => {
  const { id, title, content } = req.body;

  if (!id || !title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const record = {
    objectID: id,
    title,
    content,
  };

  index
    .saveObject(record)
    .then((algoliaObj) => {
      console.log("Algolia object saved:", algoliaObj);
      res.status(200).json({ success: true, message: "Blog saved in Algolia" });
    })
    .catch((error) => {
      console.error("Error saving to Algolia:", error);
      res.status(500).send("Error saving to Algolia");
    });
});

app.get("/search", (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: "Query parameter 'q' is required" });
  }

  index
    .search(query)
    .then(({ hits }) => {
      const objectIDs = hits.map((hit) => hit.objectID);
      res.status(200).json({ objectIDs });
    })
    .catch((error) => {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
