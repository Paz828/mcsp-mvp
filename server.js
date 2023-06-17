///////////////////////////////////////////////////////////////////////////////////////////////
// Imports and such
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

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
///////////////////////////////////////////////////////////////////////////////////////////////
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
  const { char_lvl, char_name, char_class, char_ancestry } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO party (char_lvl, char_name, char_class, char_ancestry) VALUES ($1, $2, $3, $4) RETURNING *",
      [char_lvl, char_name, char_class, char_ancestry]
    );
    res.status(201).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error").status(500);
  }
});

//DELETE one
app.delete("/party/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM party WHERE char_id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error").status(500);
  }
});
//UPDATE one
app.put("/party/:id", async (req, res) => {
  const { id } = req.params;
  let input = "";

  const bodyArr = Object.keys(req.body);
  bodyArr.forEach((elem) => {
    if (typeof req.body[elem] === "string") {
      req.body[elem] = `'${req.body[elem]}'`;
    }
    if (!input) {
      input += `${elem} = ${req.body[elem]}`;
    } else {
      input += `, ${elem} = ${req.body[elem]}`;
    }
  });

  const SQLcode = `UPDATE party SET ${input} WHERE char_id = ${id} RETURNING *;`;
  try {
    const result = await pool.query(SQLcode);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Servor Error");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////
// creatures table enpoints

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
