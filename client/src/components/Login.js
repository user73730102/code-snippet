import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [uniqueCode, setUniqueCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!uniqueCode) {
            setError('Please enter your unique code.');
            return;
        }
        try {
            const res = await axios.post('/api/auth/login', { uniqueCode });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('uniqueCode', uniqueCode);
            setToken(res.data.token);
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '5rem auto', textAlign: 'center' }}>
            <h2>Code Snippet Viewer</h2>
            <p>Enter your unique code to login or register.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your Unique Code"
                    value={uniqueCode}
                    onChange={(e) => setUniqueCode(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Login / Register
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;