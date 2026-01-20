// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Used to display error or success messages

    // Handler for the login form submission
    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents the default form submission and page reload

        try {
            // Configure the API request headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Send POST request to the Django backend login API
            // Note: Django Simple JWT often expects email as 'username' for login
            const { data } = await axios.post(
                '/api/users/login/', 
                { username: email, password: password }, 
                config
            );

            // On success, store user info (including Tokens) in Local Storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage('Login successful!');
            
            // Redirect to the product list page after successful login
            // If using React Router, replace with navigate('/') or history.push('/')
            window.location.href = '/'; 

        } catch (error) {
            setMessage(
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : 'Login Failed: Check credentials or server connection.'
            );
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Sign In</h2>
            
            {/* Display error or success message */}
            {message && (
                <div style={{ color: message.includes('successful') ? 'green' : 'red', marginBottom: '15px', padding: '10px', backgroundColor: message.includes('successful') ? '#e9ffe9' : '#ffe9e9', borderRadius: '4px' }}>
                    {message}
                </div>
            )}

            <form onSubmit={submitHandler}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                    <input
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <button 
                    type='submit' 
                    style={{ 
                        width: '100%', padding: '10px', 
                        backgroundColor: '#007bff', color: 'white', 
                        border: 'none', borderRadius: '5px', cursor: 'pointer' 
                    }}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
