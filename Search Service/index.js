const express = require("express");
const algoliasearch = require("algoliasearch");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3009 || process.env.PORT;

const client = algoliasearch("84T1JCTK99", "c5f8a909f0f537ef2d420c4ce7745ac0");
const index = client.initIndex("blogs_store");

// Use CORS and body-parser middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.post("/savepost", (req, res) => {
  //   console.log(req.body);
  //   console.log(req);
  // Create a new index and add a record
  const record = {
    objectID: req.body.id,
    title: req.body.title,
    content: req.body.content,
  };
  index
    .saveObject(record)
    .wait()
    .then((algoliaObj) => {
      console.log("algoliaObj:", algoliaObj);
      res.status(200).json({ success: true, message: "Blog saved in algolia" });
    })
    .catch((error) => {
      console.error("Error saving to Algolia:", error);
      res.status(500).send("Error saving to Algolia");
    });
});

app.get("/search", (req, res) => {
  index
    .search(req.query.q)
    .then(({ hits }) => {
      // Extract objectID from each hit and append to a new array
      const objectIDs = hits.map((hit) => Number(hit.objectID));
      // Return the array of objectIDs as the response
      res.status(200).json({ objectIDs });
    })
    .catch((error) => {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
