const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

let users = []; // Store user credentials

// Register endpoint
app.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "Registration successful" });
});

// Login endpoint
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.json({ message: "Login successful", user: { username } });
});

// Get all todos (Stored in cookies)
app.get("/todos", (req, res) => {
  const todos = req.cookies.todos ? JSON.parse(req.cookies.todos) : [];
  res.json(todos);
});

// Add a new todo (Stored in cookies)
app.post("/todos", (req, res) => {
  const { title, status, deadline } = req.body;
  if (!title || !status || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newTodo = {
    id: Date.now(),
    title,
    status,
    deadline,
    createdAt: new Date().toISOString(),
  };

  const todos = req.cookies.todos ? JSON.parse(req.cookies.todos) : [];
  todos.push(newTodo);

  res.cookie("todos", JSON.stringify(todos), { httpOnly: true });
  res.json(newTodo);
});

// Get status count within a date range
app.get("/todos/status-count", (req, res) => {
  const { startDate, endDate } = req.query;
  const todos = req.cookies.todos ? JSON.parse(req.cookies.todos) : [];

  const filteredTodos = todos.filter((todo) => todo.deadline >= startDate && todo.deadline <= endDate);
  const statusCount = filteredTodos.reduce((acc, todo) => {
    acc[todo.status] = (acc[todo.status] || 0) + 1;
    return acc;
  }, {});

  res.json(statusCount);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  let todos = req.cookies.todos ? JSON.parse(req.cookies.todos) : [];
  todos = todos.filter((t) => t.id != id);

  res.cookie("todos", JSON.stringify(todos), { httpOnly: true });
  res.json({ message: "Todo deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
