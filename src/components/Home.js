import React, {useEffect, useRef, useState} from "react";
import insertItemService from "../services/insertItemService";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import emptyImg from '../assets/images/empty.jpg';
import {DescriptionModal} from "./Modals/DescriptionModal";
import getLists from "../services/getLists";
import {AddCategoryModal} from "./Modals/AddCategoryModal";
import insertCategoryService from "../services/insertCategoryService";
import deleteCategoryService from "../services/deleteCategoryService";

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
    const [isAddingMode, setIsAddingMode] = useState(false);

    const userList = ['dv_', 'fz_'];
    const [userName, setUserName] = useState(userList[0]);
    const [isPrimary, setIsPrimary] = useState(true);

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
        if (event.target?.name !== addingItems)
            setIsAddingMode(false);
    }

    async function handleRefresh() {
        setRefresh(!refresh);
    }

    async function handleSwipeToDelete(x) {
        if (x.isDone === 1) {
            setIsLoading(true);
            deleteEntry({category: userName.concat(activeList), id: parseInt(x.id)}).then(() => setRefresh(!refresh));
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

        setIsAddingMode(false);
        setIsLoading(true);
        try {
            getCategoryList().then((firstItem) => updateList(firstItem).then(() => setIsLoading(false)));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isPrimary) setUserName(userList[0]);
        else setUserName(userList[1]);
    }, [isPrimary]);

    useEffect(() => {
        reload();
    }, [userName]);

    useEffect(() => {
        setInterval(() => {
            setShowModal(false);
        }, 3500);

        reload();
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
                                        <DropdownItem style={{textAlign: 'right', width: '100%', height: '14px'}}>
                                            <p className="fa left-stick d-flex"
                                               style={{
                                                   cursor: 'pointer',
                                                   fontSize: '12px',
                                                   marginTop: '0px',
                                                   color: '#046'
                                               }}
                                               onClick={() => deleteCategory()}>&#xf1f8; &nbsp;
                                                <p style={{textAlign: 'center'}}>{' حذف لیست'}</p>
                                                {/*&#94;&#xf014;*/}
                                            </p>
                                        </DropdownItem>

                                        <DropdownItem divider/>

                                        <DropdownItem style={{textAlign: 'right', width: '100%', height: '14px'}}
                                                      onClick={() => {
                                                          setShowCategoryModal(true);
                                                      }}>
                                            <p className="fa left-stick d-flex"
                                               style={{
                                                   cursor: 'pointer',
                                                   fontSize: '12px',
                                                   marginTop: '0px',
                                                   color: '#046'
                                               }}>&#xf067; &nbsp;
                                                <p style={{textAlign: 'center'}}>{' افزودن لیست '}</p>
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
                                        color: '#046',
                                        width: '275px'
                                    }} caret>
                                        {activeList}
                                    </DropdownToggle>
                                    <DropdownMenu className="w-100">
                                        {categoryList && categoryList.length > 0 && categoryList.map((item, index) =>
                                            <>
                                                <DropdownItem onClick={() => {
                                                    changeList(item);
                                                }} style={{textAlign: 'right'}}>
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
                                {/*<div style={{width: '50px'}}>*/}
                                {/*    <button*/}
                                {/*        onClick={() => {*/}
                                {/*            setIsPrimary(!isPrimary)*/}
                                {/*        }}*/}
                                {/*        className="btn btn-light mx-4 d-flex justify-content-center align-items-center"*/}
                                {/*        style={{width: '35px', height: '35px', borderRadius: '100%'}}>*/}

                                {/*        {isPrimary === true ?*/}
                                {/*            <span>&#128105;&#127995;</span>*/}
                                {/*            :*/}
                                {/*            <span>&#128104;&#127995;</span>*/}
                                {/*        }*/}
                                {/*    </button>*/}
                                {/*</div>*/}
                            </div>
                            {/*</div>*/}
                        </th>
                    </tr>

                    {isLoading &&
                    <div className='loaderStyle'>
                        <div className={`spinner-border spinner-border-lg  mt-5`}
                             style={{width: '125px', height: '125px', color: '#046D'}}
                             role="status"/>
                    </div>}

                    {/*<ReactPullToRefresh onRefresh={handleRefresh}>*/}
                    <div style={{height: '75vh', overflow: 'auto', backgroundColor: 'white'}}>
                        {list && (list.length < 1 && !isLoading) &&
                        <div style={{height: '75vh', overflow: 'auto', display: 'flex', alignItems: 'center'}}>
                            <img alt={''} src={emptyImg} style={{maxWidth: '100%'}}/>
                        </div>
                        }

                        {list && list.map((item, index) =>
                            item.isDone === 0 ?
                                <SwipeToDelete
                                    onDelete={() => handleSwipeToDelete(item)}
                                    height={50}
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

                                    <tr key={item.id} className={index % 2 === 0 ? "tableOdd" : "tableNormal"}>
                                        <td className="w-100" onClick={() => {
                                            handleItemClicked(item)
                                        }}>
                                            {item.items}
                                        </td>
                                    </tr>
                                </SwipeToDelete> :

                                <SwipeToDelete
                                    onDelete={() => handleSwipeToDelete(item)}
                                    height={50}
                                    transitionDuration={250}
                                    deleteWidth={75}
                                    deleteThreshold={75}
                                    showDeleteAction={true}
                                    deleteColor="rgba(252, 58, 48, 1.00)"
                                    deleteText="Delete"
                                    disabled={false}
                                    id="swiper-1"
                                    className="line-through"
                                    style={{textDecoration: 'line-through'}}
                                    rtl={false}>

                                    <tr key={item.id}
                                        className={index % 2 === 0 ? "tableOdd line-through" : "tableNormal line-through"}>
                                        <td className="w-100 line-through" onClick={() => handleItemClicked(item)}>
                                            {item.items}
                                        </td>
                                    </tr>
                                </SwipeToDelete>
                        )}
                    </div>
                    {/*</ReactPullToRefresh>*/}
                </table>
                {showCategoryModal ?
                    <div/>
                    :
                    <div className="center-div-row">
                        {isAddingMode ?
                            <div className="d-flex justify-content-center" style={{width: '90%'}}>
                                <button
                                    className="addItemButton"
                                    name={addingItems}
                                    disabled={isLoading}
                                    onClick={() => insertItem(activeList)}>
                                    &#10148;{/*&#94;*/}
                                </button>
                                <input ref={inputRef}
                                       name={addingItems}
                                       className="addItemInput"
                                       autoFocus
                                       disabled={isLoading} value={newItemValue} onChange={e => {
                                    setBody(e.target.value);
                                    setNewItemValue(e.target.value);
                                }}/>
                            </div>
                            :
                            <button
                                name={addingItems}
                                className="plusBtn"
                                onClick={() => setIsAddingMode(!isAddingMode)}>
                                &#43;
                            </button>
                        }
                    </div>
                }
                {showCategoryModal &&
                <AddCategoryModal submit={insertCategory} isLoading={isLoading} setShowModal={setShowCategoryModal}/>
                }
                {showModal &&
                <DescriptionModal item={activeItem} setShowModal={setShowModal}/>
                }
            </div>
        </div>
    );
}

export default Home;