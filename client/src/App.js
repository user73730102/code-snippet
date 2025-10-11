import React, { useState, useEffect } from 'reac;
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';


function App() {
    const [token, setToken]=useState(null);

    //  token in localStorage on initial render
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return <Dashboard token={token} setToken={setToken} />;
}

export default App;

