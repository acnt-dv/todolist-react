import React, { useState } from 'react';

function Login({ onSignup, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleLogin = () => {
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            onLoginSuccess({ username });
        } else {
            setMsg('Invalid Apple ID or password');
        }
    };

    return (
        <div style={{ position: 'absolute', top: '25%', padding: '16px' }}>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
            <button onClick={handleLogin} style={{ borderRadius: '10px', width: '100%' }}>Login</button>
            {/* <p className="message">{'msg'}</p> */}
            <p className="toggle" onClick={handleSignUp} style={{ display: 'flex', justifyContent: 'center' }}>Don't have an account?
                <p style={{ marginLeft: '8px', marginRight: '4px', color: 'blue' }}>Sign up</p>
            </p>
        </div>
    );
}

export default Login;
