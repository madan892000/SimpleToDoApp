const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let users = []; // Store user credentials
let todos = []; // Store todos in memory

// Register endpoint
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password });
    res.json({ message: "Registration successful" });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: { username } });
});

// Get all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
    const { title, status, deadline } = req.body;
    if (!title || !status || !deadline) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newTodo = {
        id: todos.length + 1,
        title,
        status,
        deadline,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    res.json(newTodo);
});

// Get status count within a date range
app.get('/todos/status-count', (req, res) => {
    const { startDate, endDate } = req.query;

    const filteredTodos = todos.filter(todo => todo.deadline >= startDate && todo.deadline <= endDate);

    const statusCount = filteredTodos.reduce((acc, todo) => {
        acc[todo.status] = (acc[todo.status] || 0) + 1;
        return acc;
    }, {});

    res.json(statusCount);
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id != id);
    res.json({ message: "Todo deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
