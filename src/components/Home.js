import { useEffect, useState } from "react";
import login from "../services/login";
import signup from "../services/signup";
import Login from "./Login";
import Signup from "./Signup";

import { Tasks } from "./Tasks";
import HamburgerMenu from "./HamburgerMenu";
import { Categories } from "./Categories";

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
    const [activeList, setActiveList] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const [showCategories, setShowCategories] = useState(true);

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

    function firstLoad(category) {
        async function getCategoryList() {
            let categories = [];
            let list = JSON.parse(await getLists())?.data;
            list.forEach(item => {
                if (Object.values(item)?.[0].includes(userName)) {
                    categories.push(Object.values(item)?.[0]?.replace(`${userName}`, ``));
                }
            });
            if (category) {
                let active = categories.find(x => x === category);
                setCategoryList(categories);
                setActiveList(active);
                return active
            }
            let firstItem = categories?.[0];
            setCategoryList(categories);
            setActiveList(firstItem);
            return firstItem;
        }

        // setIsAddingMode(false);
        setIsLoading(true);
        try {
            getCategoryList().then((firstItem) => updateList(firstItem).then(() => setIsLoading(false)));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="center-div" style={{overflow: "hidden"}} onClick={(e) => handleMouseClicked(e)} onKeyPress={(e) => {
            handleKeyPress(e);
        }}>
            {!loginModal && !signupModal &&
                <div style={{ width: '100%', backgroundColor: 'white', display: 'grid', justifyContent: 'end', alignItems: 'center' }}>
                    <div style={{ minWidth: '100vw', backgroundColor: 'gray', height: '75px', display: 'grid', justifyContent: 'start', alignItems: 'center' }}>
                        <HamburgerMenu
                            handleUser={handleUser}
                            setShowCategories={setShowCategories}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                    {isLoggedIn && showCategories &&
                        <Categories
                            addingItems={addingItems}
                            userName={userCategory}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            handleUser={handleUser}
                            isAddingMode={isAddingMode}
                            setIsAddingMode={setIsAddingMode}
                            addByKey={addByKey}
                            setAddByKey={setAddByKey}
                            activeList={activeList}
                            setActiveList={setActiveList}
                            setShowCategories={setShowCategories}
                        />
                    }
                    {isLoggedIn && !showCategories &&
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
                            activeList={activeList}
                            setActiveList={setActiveList}
                            setIsOpen={setIsOpen}
                        />
                    }

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