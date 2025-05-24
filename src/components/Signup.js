function Signup({ handleSignUp, onLogin, username, setUsername, password, setPassword, msg }) {

    return (
        <div style={{ padding: '16px', width: '100%', height: '100vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'grid', width: '100%'}}>
                <h2>Sign Up</h2>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '8px', textAlign: 'left' }} />
                <button onClick={handleSignUp} style={{ borderRadius: '0', width: '100%', backgroundColor: 'gray' }}>Sign Up</button>
                {msg?.length > 0 &&
                    <p className="message" style={{ color: msg.includes('successful') ? 'green' : 'red' }}>{msg}</p>
                }
                <p className="toggle" onClick={onLogin} style={{ display: 'flex', justifyContent: 'center' }}>Already have an account?
                    <p style={{ marginLeft: '8px', marginRight: '4px', color: 'gray' }}>Login</p>
                </p>
            </div>
        </div >
    );
}

export default Signup;
