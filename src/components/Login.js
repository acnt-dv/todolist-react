function Login({ handleLogin, onSignup, username, setUsername, password, setPassword, msg }) {

    return (
        <div style={{ padding: '16px', width: '100%', height: '100vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'grid', }}>
                <h2>Login</h2>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <button onClick={handleLogin} style={{ borderRadius: '10px', width: '100%' }}>Login</button>
                <p className="message">{msg}</p>
                <p className="toggle" onClick={onSignup} style={{ display: 'flex', justifyContent: 'center' }}>Don't have an account?
                    <p style={{ marginLeft: '8px', marginRight: '4px', color: 'blue' }}>Sign up</p>
                </p>
            </div>
        </div>
    );
}

export default Login;
