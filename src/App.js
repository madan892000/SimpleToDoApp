import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ text: "", status: "Pending", deadline: "" });
    const [editTodo, setEditTodo] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [registerMode, setRegisterMode] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusCounts, setStatusCounts] = useState(null);
    const [ErrMsg, setErrMsg] = useState(false);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
        setTodos(storedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleLogin = () => {
        if (email && password) {
            localStorage.setItem("user", JSON.stringify({ email }));
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    const handleRegister = () => {
        alert("Registration successful! Please log in.");
        setRegisterMode(false);
    };

    const handleAddTodo = () => {
        if (newTodo.text && newTodo.deadline) {
            const newEntry = { ...newTodo, id: Date.now(), createdAt: new Date().toISOString() };
            setTodos([...todos, newEntry]);
            setNewTodo({ text: "", status: "Pending", deadline: "" });
        }
    };

    const handleEditTodo = () => {
        if (editTodo) {
            setTodos(todos.map(todo => (todo.id === editTodo.id ? editTodo : todo)));
            setEditTodo(null);
        }
    };

    const handleDeleteTodo = id => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const startEditing = todo => {
        setEditTodo({ ...todo });
    };

    const filterTodosByDate = () => {
        if (!startDate || !endDate) return todos;
        return todos.filter(todo => todo.deadline >= startDate && todo.deadline <= endDate);
    };

    const calculateStatusCounts = () => {
        const filteredTodos = filterTodosByDate();
        if (startDate === "" || endDate === ""){
            setErrMsg(true)
            return;
        }
        setErrMsg(false);
        const counts = { Pending: 0, InProgress: 0, Completed: 0 };
        filteredTodos.forEach(todo => counts[todo.status]++);
        setStatusCounts(counts);
    };

    return (
        <div>
            {!isLoggedIn ? (
                <div className="auth-container">
                    {registerMode ? (
                        <>
                            <h2>Register</h2>
                            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            <button onClick={handleRegister}>Register</button>
                            <p onClick={() => setRegisterMode(false)}>Already have an account? Login</p>
                        </>
                    ) : (
                        <>
                            <h2>Login</h2>
                            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            <button onClick={handleLogin}>Login</button>
                            <p onClick={() => setRegisterMode(true)}>Don't have an account? Register</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="container">
                    <button className="logout" onClick={handleLogout}>Logout</button>
                    <h2>Todo App</h2>

                    <div className="todo-form">
                        <input type="text" placeholder="Enter Todo" value={newTodo.text} onChange={e => setNewTodo({ ...newTodo, text: e.target.value })} />
                        <select value={newTodo.status} onChange={e => setNewTodo({ ...newTodo, status: e.target.value })}>
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <input type="date" value={newTodo.deadline} onChange={e => setNewTodo({ ...newTodo, deadline: e.target.value })} />
                        <button onClick={handleAddTodo}>Add Todo</button>
                    </div>

                    <div className="filter-section">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        <button onClick={calculateStatusCounts}>Show Count</button>
                    </div>

                    {
                        ErrMsg ? (<p>The start and end date need to be mentioned for the count to be displayed</p>) : (statusCounts && (
                            <div className="status-counts">
                                <p>Pending: {statusCounts.Pending}</p>
                                <p>In Progress: {statusCounts.InProgress}</p>
                                <p>Completed: {statusCounts.Completed}</p>
                            </div>
                        ))
                    }

                    <ul>
                        {filterTodosByDate().map(todo => (
                            <li key={todo.id}>
                                {editTodo && editTodo.id === todo.id ? (
                                    <>
                                        <input type="text" value={editTodo.text} onChange={e => setEditTodo({ ...editTodo, text: e.target.value })} />
                                        <select value={editTodo.status} onChange={e => setEditTodo({ ...editTodo, status: e.target.value })}>
                                            <option value="Pending">Pending</option>
                                            <option value="InProgress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <input type="date" value={editTodo.deadline} onChange={e => setEditTodo({ ...editTodo, deadline: e.target.value })} />
                                        <button onClick={handleEditTodo}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{todo.text} - {todo.status} (Due: {todo.deadline})</span>
                                        <button onClick={() => startEditing(todo)}>Edit</button>
                                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
