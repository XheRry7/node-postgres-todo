import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json()); // this let us add req.body

// Routes

// create
app.post("/create", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// get all

app.get("/get", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// get a todo

app.get("/getone/:id", async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  try {
    const Todo = await pool.query(`SELECT * FROM todo WHERE todo_id = $1`, [
      id,
    ]);
    if (Todo.rows && Todo.rows.length) {
      res.json(Todo.rows);
    }
    res.json({ message: "no todo with this id exist" });
  } catch (error) {
    console.log(error.message);
  }
});

//update
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  try {
    const update = await pool.query(
      `UPDATE todo SET description = $1 WHERE todo_id = $2`,
      [description, id]
    );
    res.json({ message: "updated successfully", data: update });
  } catch (error) {
    console.log(error.message);
  }
});

// delete

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`DELETE FROM todo  WHERE todo_id = $1`, [id]);
    res.json("todo deleted successfully");
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
