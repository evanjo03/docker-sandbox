require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const db = require("./db");

// Start the server
app.listen(port, async () => {
  const pool = await db.setupDatabase();
  console.log(`Server running on port ${port}`);

  app.use(cors());
  app.use(bodyParser.json());

  // Create an item
  app.post("/api/items", async (req, res) => {
    try {
      const { description, status } = req.body;
      const result = await pool.query(
        "INSERT INTO items (description, status) VALUES ($1, $2) RETURNING id",
        [description, status],
      );

      const newItem = {
        id: result.rows[0].id,
        description,
        status,
      };

      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM items");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const result = await pool.query(
        "DELETE FROM items WHERE id = $1 RETURNING *",
        [itemId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/healthcheck", (_, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });
});
