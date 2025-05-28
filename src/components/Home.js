import { useEffect, useState } from "react";
import login from "../services/login";
import signup from "../services/signup";
import Login from "./Login";
import Signup from "./Signup";

import { Tasks } from "./Tasks";

function Home() {
    const addingItems = "ADD_ING_INPUT_S";

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [signupModal, setSignupModal] = useState(false);
    const [userCategory, setUserCategory] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState();
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [addByKey, setAddByKey] = useState(false);

    function handleKeyPress(event) {
        if (event.charCode === 13) {
            if (loginModal) {
                handleLogin();
            } else if (signupModal) {
                handleSignUp();
            } else {
                setAddByKey(true);
            }
        }
    }

    function handleMouseClicked(event) {
        if (event.target?.name !== addingItems)
            setIsAddingMode(false);
    }

    const handleUser = () => {
        localStorage.removeItem('auth');
        setIsLoggedIn(false);
        setLoginModal(true);
        setUsername('');
        setPassword('');
        setMsg('');
    }

    const handleLogin = async () => {
        try {
            if (!username.trim() || !password.trim()) {
                setMsg('Username and password are required');
                return;
            }

            if (password?.length < 4) {
                setMsg('Password must be at least 4 characters');
                return;
            }

            const loginResult = await login({ username, password });
            localStorage.setItem('userName', username);
            localStorage.setItem('auth', true);
            setIsLoggedIn(true);
            setLoginModal(false);
            setUserCategory(`${username}_`);
        } catch (error) {
            setMsg(error?.response?.data?.errorMessage);
        }
    }

    const handleSignUp = async () => {
        try {
            if (!username.trim() || !password.trim()) {
                setMsg('Username and password are required');
                return;
            }

            if (password?.length < 4) {
                setMsg('Password must be at least 4 characters');
                return;
            }

            const signupResult = await signup({ username, password });
            console.info(signupResult);
            const loginResult = await login({ username, password });
            console.info(loginResult);
            setIsLoggedIn(true);
            setUserCategory(`${username}_`);
            setSignupModal(false);
            setLoginModal(false);
        } catch (error) {
            setMsg(error?.response?.data?.errorMessage);
        }
    }

    const onSignup = () => {
        setSignupModal(true);
        setLoginModal(false);
        setMsg('');
    }

    const onLogin = () => {
        setLoginModal(true);
        setSignupModal(false);
        setMsg('');
    }

    useEffect(() => {
        const isAlreadyLoggedIn = localStorage.getItem('auth');
        const savedUserName = localStorage.getItem('userName');

        setUserCategory(`${savedUserName}_`);
        if (isAlreadyLoggedIn) setIsLoggedIn(true);

        if (isAlreadyLoggedIn) {
            setLoginModal(false);
            setInterval(() => {
                // setShowModal(false);
            }, 3500);

            // reload();
        } else {
            setLoginModal(true);
        }
    }, []);

    return (
        <div className="center-div" onClick={(e) => handleMouseClicked(e)} onKeyPress={(e) => {
            handleKeyPress(e);
        }}>
            {isLoggedIn &&
                <div className="center-div-col">
                    <Tasks
                        addingItems={addingItems}
                        userName={userCategory}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        handleUser={handleUser}
                        isAddingMode={isAddingMode}
                        setIsAddingMode={setIsAddingMode}
                        addByKey={addByKey}
                        setAddByKey={setAddByKey}
                    />
                </div>
            }
            {loginModal &&
                <Login
                    onSignup={onSignup}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    msg={msg}
                    setMsg={setMsg}
                    handleLogin={handleLogin}
                />
            }
            {signupModal &&
                <Signup
                    onLogin={onLogin}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    msg={msg}
                    setMsg={setMsg}
                    handleSignUp={handleSignUp}
                />
            }
        </div>
    );
}

export default Home;