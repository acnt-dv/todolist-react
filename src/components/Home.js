import React, { useEffect, useRef, useState } from "react";
import insertItemService from "../services/insertItemService";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import emptyImg from '../assets/images/empty.jpg';
import { DescriptionModal } from "./Modals/DescriptionModal";
import getLists from "../services/getLists";
import { AddCategoryModal } from "./Modals/AddCategoryModal";
import insertCategoryService from "../services/insertCategoryService";
import deleteCategoryService from "../services/deleteCategoryService";
import login from "../services/login";
import signup from "../services/signup";
import Login from "./Login";
import Signup from "./Signup";

function Home() {

    const inputRef = useRef(null);

    const addingItems = "ADD_ING_INPUT_S";

    const [list, setList] = useState([]);
    const [body, setBody] = useState('body');
    const [newItemValue, setNewItemValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [activeList, setActiveList] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [isAddingMode, setIsAddingMode] = useState(true);

    const userList = ['dv_', 'fz_'];
    const [userName, setUserName] = useState(userList[0]);
    const [isPrimary, setIsPrimary] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [signupModal, setSignupModal] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState();

    function insertCategory(category) {
        setIsLoading(true);
        insertCategoryService({
            "category": userName.concat(category),
        }).then(() => {
            setActiveList(category);
            reload(category);
        });
    }

    function deleteCategory() {
        setIsLoading(true);
        deleteCategoryService({
            "category": userName.concat(activeList)
        }).then(() => {
            reload();
        });
    }

    function insertItem(category) {
        setIsLoading(true);
        setNewItemValue('');
        insertItemService({
            "category": userName.concat(category),
            "body": body
        }).then(() => {
            setRefresh(!refresh);
        });
    }

    function changeList(category) {
        setActiveList(category);
        setRefresh(!refresh);
    }

    async function updateList(category) {
        try {
            let listItems = JSON.parse(await getList(userName.concat(category)))?.data;
            listItems && listItems.sort(function compareByDone(a, b) {
                return a.isDone - b.isDone;
            }
            );
            setList(listItems);
            setActiveList(category);
        } catch (e) {
            console.error(e);
        }
    }

    function handleKeyPress(event) {
        if (event.charCode === 13) {
            insertItem(activeList);
        }
    }

    function handleMouseClicked(event) {
        // if (event.target?.name !== addingItems)
        //     setIsAddingMode(false);
    }

    async function handleRefresh() {
        setRefresh(!refresh);
    }

    async function handleSwipeToDelete(x) {
        if (x.isDone === 1) {
            setIsLoading(true);
            deleteEntry({ category: userName.concat(activeList), id: parseInt(x.id) }).then(() => setRefresh(!refresh));
        } else {
            setIsLoading(true);
            updateTheList({
                "category": userName.concat(activeList),
                "id": parseInt(x.id)
            }).then(() => setRefresh(!refresh));
        }
    }

    function handleItemClicked(item) {
        setActiveItem(item.items);
        setShowModal(true);
    }

    async function handleItemDoubleClicked(item) {
        await handleSwipeToDelete(item);
    }

    function reload(category) {
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

    const handleUser = () => {
        setIsLoggedIn(false);
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
            setIsLoggedIn(true);
            setUserName(`${username}_`);
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
            setUserName(`${username}_`);
            setSignupModal(false);
            setLoginModal(false);
        } catch (error) {
            setMsg(error?.response?.data?.errorMessage);
        }
    }

    const onSignup = () => {
        setSignupModal(true);
        setMsg('');
    }

    const onLogin = () => {
        setLoginModal(true);
        setSignupModal(false);
        setMsg('');
    }

    useEffect(() => {
        if (!showCategoryModal) setIsAddingMode(true);
    }, [showCategoryModal]);

    useEffect(() => {
        reload();
    }, [userName]);

    useEffect(() => {
        if (isLoggedIn) {
            setInterval(() => {
                setShowModal(false);
            }, 3500);

            reload();
        } else {
            setLoginModal(true);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setList([]);
        updateList(activeList).then(() => {
            setIsLoading(false);
            inputRef?.current?.focus();
            inputRef?.current?.select();
        });
    }, [refresh]);

    return (
        <div className="center-div" onClick={(e) => handleMouseClicked(e)} onKeyPress={(e) => {
            handleKeyPress(e);
        }}>
            {isLoggedIn &&
                <div className="center-div-col">

                    <table id="items">
                        <tr>
                            <th className="d-flex w-100 justify-content-center">
                                {/*<div className="row w-100">*/}
                                <div className="d-flex w-100 justify-content-center">
                                    {/*<div>*/}
                                    <Dropdown
                                        className="listButton"
                                        disabled={isLoading}
                                        isOpen={actionDropdownOpen}
                                        toggle={() => setActionDropdownOpen(!actionDropdownOpen)}>
                                        <DropdownToggle className="dropdown-toggle-custom" style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            color: 'white',
                                            width: '100%'
                                        }} caret>
                                            &#8942;
                                        </DropdownToggle>

                                        <DropdownMenu>
                                            {/*<DropdownItem style={{textAlign: 'right', width: '100%', height: '14px'}}*/}
                                            {/*              onClick={() => {*/}
                                            {/*                  // setShowCategoryModal(true);*/}
                                            {/*              }}>*/}
                                            {/*    <p className="fa left-stick d-flex"*/}
                                            {/*       style={{*/}
                                            {/*           cursor: 'pointer',*/}
                                            {/*           fontSize: '12px',*/}
                                            {/*           marginY: '5px',*/}
                                            {/*           color: '#046'*/}
                                            {/*       }}>&#xf1fb;&nbsp;*/}
                                            {/*        <p style={{textAlign: 'center'}}>{'ویرایش لیست'}</p>*/}
                                            {/*    </p>*/}
                                            {/*</DropdownItem>*/}
                                            <DropdownItem style={{ textAlign: 'right', width: '100%', height: '14px' }}>
                                                <p className="fa left-stick d-flex"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        marginTop: '0px',
                                                        color: '#777'
                                                    }}
                                                    onClick={() => deleteCategory()}>&#xf1f8; &nbsp;
                                                    <p style={{ textAlign: 'center' }}>{' حذف لیست'}</p>
                                                    {/*&#94;&#xf014;*/}
                                                </p>
                                            </DropdownItem>

                                            <DropdownItem divider />

                                            <DropdownItem style={{ textAlign: 'right', width: '100%', height: '14px' }}
                                                onClick={() => {
                                                    setIsAddingMode(false);
                                                    setShowCategoryModal(true);
                                                }}>
                                                <p className="fa left-stick d-flex"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        marginTop: '0px',
                                                        color: '#777'
                                                    }}>&#xf067; &nbsp;
                                                    <p style={{ textAlign: 'center' }}>{' افزودن لیست '}</p>
                                                </p>
                                            </DropdownItem>

                                            <DropdownItem divider />

                                            <DropdownItem style={{ textAlign: 'right', width: '100%', height: '14px' }}
                                                onClick={handleUser}>
                                                <p className="fa left-stick d-flex"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        marginTop: '0px',
                                                        color: '#777'
                                                    }}>&#10006; &nbsp;
                                                    <p style={{ textAlign: 'center' }}>{'خروج'}</p>
                                                </p>
                                            </DropdownItem>

                                        </DropdownMenu>
                                    </Dropdown>

                                    <Dropdown
                                        className="listInput"
                                        disabled={isLoading}
                                        isOpen={dropdownOpen}
                                        toggle={() => setDropdownOpen(!dropdownOpen)}>
                                        <DropdownToggle style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            color: '#777',
                                            width: '250px'
                                        }} caret>
                                            {activeList}
                                        </DropdownToggle>
                                        <DropdownMenu className="w-100">
                                            {categoryList && categoryList.length > 0 && categoryList.map((item, index) =>
                                                <>
                                                    <DropdownItem onClick={() => {
                                                        changeList(item);
                                                    }} style={{ textAlign: 'right' }}>
                                                        {item}
                                                    </DropdownItem>
                                                </>
                                            )}
                                            {/*<DropdownItem divider/>*/}
                                            {/*<DropdownItem onClick={() => {*/}
                                            {/*    setShowCategoryModal(true);*/}
                                            {/*}} style={{textAlign: 'right', color: '#046'}}>*/}
                                            {/*    <div className="d-flex" style={{maxHeight: '25px'}}>*/}
                                            {/*        <p style={{*/}
                                            {/*            padding: '0px',*/}
                                            {/*            textAlign: 'center',*/}
                                            {/*            marginLeft: '12px',*/}
                                            {/*            fontSize: '20px'*/}
                                            {/*        }}>&#43;</p>*/}
                                            {/*        <p style={{textAlign: 'center'}}>{'افزودن'}</p>*/}
                                            {/*    </div>*/}
                                            {/*</DropdownItem>*/}
                                        </DropdownMenu>
                                    </Dropdown>
                                    {/*</div>*/}
                                    {/* <div style={{ width: '50px' }}>
                                        <button
                                            // onClick={() => {
                                            //     setIsPrimary(!isPrimary)
                                            // }}
                                            onClick={handleUser}
                                            className="btn btn-light mx-3 mt-1 d-flex justify-content-center align-items-center"
                                            style={{ width: '35px', height: '35px', borderStyle: '5px solid', borderRadius: '100%', borderColor: 'white', background: 'transparent' }}>
                                            <span>&#128128;</span>
                                            {isPrimary === true ?
                                                <span>&#128105;&#127995;</span>
                                                :
                                                <span>&#128104;&#127995;</span>
                                            }
                                        </button>
                                    </div> */}
                                </div>
                                {/*</div>*/}
                            </th>
                        </tr>

                        {isLoading &&
                            <div className='loaderStyle'>
                                <div className={`spinner-border spinner-border-lg  mt-5`}
                                    style={{ width: '125px', height: '125px', color: '#777' }}
                                    role="status" />
                            </div>}

                        {/*<ReactPullToRefresh onRefresh={handleRefresh}>*/}
                        <div style={{ height: '75vh', overflow: 'auto', backgroundColor: 'white' }}>
                            {list && (list.length < 1 && !isLoading) &&
                                <div style={{ height: '75vh', overflow: 'auto', display: 'flex', alignItems: 'center' }}>
                                    <img alt={''} src={emptyImg} style={{ maxWidth: '100%' }} />
                                </div>
                            }

                            {list && list.map((item, index) =>
                                item.isDone === 0 ?
                                    <SwipeToDelete
                                        onDelete={() => handleSwipeToDelete(item)}
                                        height={55}
                                        transitionDuration={250}
                                        deleteWidth={75}
                                        deleteThreshold={75}
                                        showDeleteAction={true}
                                        deleteColor="rgba(52, 58, 248, 1.00)"
                                        deleteText="Done"
                                        disabled={false}
                                        id="swiper-1"
                                        className="my-swiper"
                                        rtl={false}>

                                        {/* <tr key={item.id} className={index % 2 === 0 ? "tableOdd" : "tableNormal"}> */}
                                        <tr key={item.id} className="tableStyle">
                                            <td className="w-100" onClick={() => {
                                                handleItemClicked(item)
                                            }}>
                                                {item.items}
                                            </td>
                                        </tr>
                                    </SwipeToDelete> :

                                    <SwipeToDelete
                                        onDelete={() => handleSwipeToDelete(item)}
                                        height={55}
                                        transitionDuration={250}
                                        deleteWidth={75}
                                        deleteThreshold={75}
                                        showDeleteAction={true}
                                        deleteColor="rgba(252, 58, 48, 1.00)"
                                        deleteText="Delete"
                                        disabled={false}
                                        id="swiper-1"
                                        className="line-through"
                                        style={{ textDecoration: 'line-through' }}
                                        rtl={false}>

                                        {/* <tr key={item.id} className={index % 2 === 0 ? "tableOdd line-through" : "tableNormal line-through"}> */}
                                        <tr key={item.id} className="tableStyle">
                                            <td className="w-100 line-through" style={{ textDecoration: 'line-through', color: 'black', textDecorationThickness: '3px', textDecorationColor: 'red' }} onClick={() => handleItemClicked(item)}>
                                                {item.items}
                                            </td>
                                        </tr>
                                    </SwipeToDelete>
                            )}
                        </div>
                        {/*</ReactPullToRefresh>*/}
                    </table>

                    {isAddingMode &&
                        <div className="center-div" style={{ width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
                            <button
                                className="addItemButton"
                                name={addingItems}
                                disabled={isLoading}
                                onClick={() => insertItem(activeList)}>
                                {/* &#94; */}
                                <p style={{ transform: 'rotate(-90deg)', marginTop: '-2px', marginLeft: '2px' }}>&#10148;</p>
                            </button>
                            <input ref={inputRef}
                                name={addingItems}
                                className="addItemInput"
                                autoFocus
                                disabled={isLoading} value={newItemValue} onChange={e => {
                                    setBody(e.target.value);
                                    setNewItemValue(e.target.value);
                                }} />
                        </div>
                        // :
                        // <button
                        //     name={addingItems}
                        //     className="plusBtn"
                        //     onClick={() => setIsAddingMode(!isAddingMode)}>
                        //     &#43;
                        // </button>
                    }
                    {showCategoryModal &&
                        <AddCategoryModal submit={insertCategory} isLoading={isLoading} setShowModal={setShowCategoryModal} />
                    }
                    {showModal &&
                        <DescriptionModal item={activeItem} setShowModal={setShowModal} />
                    }

                </div>
            }
            {!isLoggedIn && !signupModal &&
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