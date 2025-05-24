function Login({ handleLogin, onSignup, username, setUsername, password, setPassword, msg }) {

    return (
        <div style={{ padding: '16px', width: '100%', height: '100vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'grid', width: '100%'}}>
                <h2>Login</h2>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <button onClick={handleLogin} style={{ borderRadius: '0', width: '100%', backgroundColor: 'gray' }}>Login</button>
                {msg?.length > 0 &&
                    <p className="message">{msg}</p>
                }
                <p className="toggle" onClick={onSignup} style={{ display: 'flex', justifyContent: 'center' }}>Don't have an account?
                    <p style={{ marginLeft: '8px', marginRight: '4px', color: 'gray' }}>Sign up</p>
                </p>
            </div>
        </div>
    );
}

export default Login;
