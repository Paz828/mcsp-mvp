//
const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
dotenv.config();

const PORT = process.env.PORT;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.static("public"));
app.use(express.json());

// party table endpoints

// GET All
app.get("/party", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM party");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET One
app.get("/party/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM party WHERE char_id = $1", [
      id,
    ]);
    res.json(result.rows[0]).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//CREATE one
app.post("/party", async (req, res) => {
  const { char_lvl, char_name, char_class, cast_spells } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO party (char_lvl, char_name, char_class, cast_spells) VALUES ($1, $2, $3, $4) RETURNING *",
      [char_lvl, char_name, char_class, cast_spells]
    );
    res.status(201).send(result.rows);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error").status(500);
  }
});

//DELETE one

// creatures table enpoints

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
