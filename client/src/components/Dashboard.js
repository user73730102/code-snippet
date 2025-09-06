import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

// Helper function to set the auth token for all axios requests
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

const Dashboard = ({ token, setToken }) => {
    // State for the list of snippets
    const [snippets, setSnippets] = useState([]);
    
    // State for the form data (used for both creating and editing)
    const [formData, setFormData] = useState({ title: '', language: 'javascript', code: '' });
    
    // State to track the ID of the snippet being edited. null means we are in "create" mode.
    const [editingId, setEditingId] = useState(null);

    const userCode = localStorage.getItem('uniqueCode');

    // Function to fetch snippets from the server
    const fetchSnippets = async () => {
        try {
            const res = await axios.get('/api/snippets');
            setSnippets(res.data);
        } catch (error) {
            console.error('Error fetching snippets', error);
        }
    };
    
    // useEffect runs when the component mounts or the token changes
    useEffect(() => {
        if (token) {
            setAuthToken(token);
            fetchSnippets();
        }
    }, [token]);

    // Handler for form input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- CRUD Function: DELETE ---
    const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
        try {
            await axios.delete(`/api/snippets/${id}`);
            
            // --- THIS IS THE FIX ---
            // Use the functional update form to guarantee we're working with the latest state
            setSnippets(prevSnippets => 
                prevSnippets.filter(snippet => snippet._id !== id)
            );

        } catch (error) {
            console.error('Error deleting snippet', error);
            alert('Could not delete the snippet.');
        }
    }
};

    // --- Function to set the component into "Edit Mode" ---
    const handleEdit = (snippet) => {
        setEditingId(snippet._id); // Set the ID of the snippet we're editing
        // Populate the form with the data from the snippet to be edited
        setFormData({ 
            title: snippet.title, 
            language: snippet.language, 
            code: snippet.code 
        });
        window.scrollTo(0, 0); // Scroll to the top to see the form
    };

    // --- Function to cancel editing ---
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', language: 'javascript', code: '' });
    };

    // --- Main Form Submission Logic (Handles both CREATE and UPDATE) ---
    // client/src/components/Dashboard.js

// ... (rest of the component code)

const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // If editingId is not null, we are in UPDATE mode
    if (editingId) {
        try {
            const res = await axios.patch(`/api/snippets/${editingId}`, formData);
            
            // --- THIS IS THE FIX ---
            // Use the functional update form to ensure we have the latest state
            setSnippets(prevSnippets => 
                prevSnippets.map(snippet =>
                    snippet._id === editingId ? res.data : snippet
                )
            );
            
        } catch (error) {
            // It's also good practice to log the actual error
            console.error('Error updating snippet:', error);
            alert('Could not update snippet.');
        }
    } else {
        // --- CREATE LOGIC (remains the same) ---
        try {
            const res = await axios.post('/api/snippets', formData);
            // We can also use functional update here for consistency and safety
            setSnippets(prevSnippets => [res.data, ...prevSnippets]);
        } catch (error) {
            console.error('Error saving snippet:', error);
        }
    }
    
    // Reset the form and exit edit mode after submission
    cancelEdit();
};

// ... (rest of the component code)
    
    // Logout Handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('uniqueCode');
        setToken(null);
        setAuthToken(null);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {userCode}</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <div className="snippet-form-card">
                <h3>{editingId ? 'Edit Snippet' : 'Paste a New Snippet'}</h3>
                
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text" name="title" placeholder="Snippet Title"
                        value={formData.title} onChange={handleInputChange}
                    />
                    <select
                        name="language" value={formData.language} onChange={handleInputChange}
                    >
                        <option value="javascript">C++</option>
                        <option value="python">Python</option>
                        <option value="html">JavaScript</option>
                        <option value="css">CSS</option>
                        <option value="sql">Other</option>
                    </select>
                    <textarea
                        name="code" placeholder="Paste your code here..." required rows="10"
                        value={formData.code} onChange={handleInputChange}
                    ></textarea>
                    <div className="form-actions">
                        <button type="submit">
                            {editingId ? 'Update Snippet' : 'Save Snippet'}
                        </button>
                        {editingId && (
                           <button type="button" className="cancel-btn" onClick={cancelEdit}>
                               Cancel
                           </button> 
                        )}
                    </div>
                </form>
            </div>

            <div className="snippet-list">
                <h2>Your Snippets</h2>
                {snippets.length === 0 ? (
                    <p>You have no snippets yet. Paste one above to get started!</p>
                ) : (
                    snippets.map(snippet => (
                        <div key={snippet._id} className="snippet-card">
                            <div className="snippet-header">
                                <h4>{snippet.title}</h4>
                                <div className="snippet-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(snippet)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(snippet._id)}>Delete</button>
                                </div>
                            </div>
                            <p className="meta">Language: {snippet.language} | Created: {new Date(snippet.createdAt).toLocaleString()}</p>
                            <SyntaxHighlighter language={snippet.language} style={docco} showLineNumbers>
                                {snippet.code}
                            </SyntaxHighlighter>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;