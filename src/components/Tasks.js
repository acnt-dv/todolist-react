import { useEffect, useRef, useState } from "react";
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
import Collapsible from "./Collapsible";
import { toast } from "react-toastify";

export const Tasks = ({ addingItems, userName, refresh, setRefresh, handleUser, isAddingMode, setIsAddingMode, addByKey, setAddByKey }) => {
    const inputRef = useRef(null);
    const holdTimeoutRef = useRef(null);

    const startHoldTimer = (item) => {
        holdTimeoutRef.current = setTimeout(() => {
            handleItemClicked(item);
        }, 400);
    };

    const clearHoldTimer = () => {
        clearTimeout(holdTimeoutRef.current);
        setShowModal(false);
    };

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
            setIsAddingMode(true);
            setAddByKey(false);
        });
    }

    function changeList(category) {
        setActiveList(category);
        setRefresh(!refresh);
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    async function updateList(category) {
        try {
            let listItems = JSON.parse(await getList(userName?.concat(category)))?.data;
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

    const copyFallback = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const success = document.execCommand('copy');
            console.log(success ? 'Copied (fallback)' : 'Failed (fallback)');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textarea);
    };

    const handleItemCopy = async (item) => {
        try {
            await navigator.clipboard.writeText(item?.items);
            toast.success("Copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        // const text = item?.items;
        // if (navigator.clipboard?.writeText) {
        //     navigator.clipboard.writeText(text).then(() => {
        //         console.log('Copied');
        //     }).catch(err => {
        //         console.error('Copy failed:', err);
        //         copyFallback(text); // try fallback
        //     });
        // } else {
        //     copyFallback(text); // fallback for non-secure context
        // }
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

    useEffect(() => {
        if (!userName) handleUser();
        reload();
    }, [userName]);

    useEffect(() => {
        // if (!showCategoryModal) setIsAddingMode(true);
    }, [showCategoryModal]);

    useEffect(() => {
        setIsLoading(true);
        setList([]);
        updateList(activeList).then(() => {
            setIsLoading(false);
        });
    }, [refresh]);

    useEffect(() => {
        if (isAddingMode) {
            setTimeout(() => {
                inputRef.current?.focus();
                // inputRef?.current?.select();
            }, 100);
        }
    }, [isAddingMode]);

    useEffect(() => {
        if (addByKey) insertItem(activeList);
    }, [addByKey]);

    return (
        <>
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
                                            // setIsAddingMode(false);
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

                    <>
                        {list && list
                            .filter(item => item.isDone === 0)
                            .map(item => (
                                <SwipeToDelete
                                    key={item.id}
                                    onDelete={() => handleSwipeToDelete(item)}
                                    height={55}
                                    transitionDuration={250}
                                    deleteWidth={75}
                                    deleteThreshold={75}
                                    showDeleteAction={true}
                                    deleteColor="rgba(52, 58, 248, 1.00)"
                                    deleteText="Done"
                                    disabled={false}
                                    id={`swiper-${item.id}`}
                                    className="my-swiper"
                                    rtl={false}
                                >
                                    <tr className="tableStyle">
                                        <td
                                            className="w-100"
                                            onClick={() => handleItemCopy(item)}
                                            onMouseDown={() => startHoldTimer(item)}
                                            onMouseUp={clearHoldTimer}
                                            onMouseLeave={clearHoldTimer}
                                            onTouchStart={() => startHoldTimer(item)}
                                            onTouchEnd={clearHoldTimer}
                                            onTouchCancel={clearHoldTimer}
                                        >
                                            {item.items}
                                        </td>
                                    </tr>
                                </SwipeToDelete>
                            ))
                        }

                        {list && (list.length > 0 && !isLoading) &&
                            <Collapsible title={`${list && list.filter(item => item.isDone !== 0).length} کار خاتمه یافته است`}>
                                {list && list
                                    .filter(item => item.isDone !== 0)
                                    .map(item => (
                                        <SwipeToDelete
                                            key={item.id}
                                            onDelete={() => handleSwipeToDelete(item)}
                                            height={55}
                                            transitionDuration={250}
                                            deleteWidth={75}
                                            deleteThreshold={75}
                                            showDeleteAction={true}
                                            deleteColor="rgba(252, 58, 48, 1.00)"
                                            deleteText="Delete"
                                            disabled={false}
                                            id={`swiper-${item.id}`}
                                            className="my-swiper"
                                            rtl={false}
                                        >
                                            <tr className="tableStyle">
                                                <td
                                                    className="w-100"
                                                    style={{
                                                        textDecoration: 'line-through',
                                                        color: 'black',
                                                        textDecorationColor: 'red',
                                                        textDecorationThickness: '3px',
                                                    }}
                                                    onClick={() => handleItemCopy(item)}
                                                    onMouseDown={() => startHoldTimer(item)}
                                                    onMouseUp={clearHoldTimer}
                                                    onMouseLeave={clearHoldTimer}
                                                    onTouchStart={() => startHoldTimer(item)}
                                                    onTouchEnd={clearHoldTimer}
                                                    onTouchCancel={clearHoldTimer}
                                                >
                                                    {item.items}
                                                </td>
                                            </tr>
                                        </SwipeToDelete>
                                    ))}
                            </Collapsible>
                        }
                    </>
                </div>
                {/*</ReactPullToRefresh>*/}
            </table>

            {<div style={{ position: 'relative', width: '100%' }}>
                <div className={`transition-wrapper ${isAddingMode ? 'show' : 'hide'}`}>
                    <div className="center-div" style={{ width: '100%', padding: '0 24px' }}>
                        <button
                            className="addItemButton"
                            name={addingItems}
                            disabled={isLoading}
                            onClick={() => insertItem(activeList)}
                        >
                            <p style={{ transform: 'rotate(-90deg)', marginTop: '-2px', marginLeft: '2px' }}>
                                &#10148;
                            </p>
                        </button>
                        <input
                            ref={inputRef}
                            name={addingItems}
                            className="addItemInput"
                            autoFocus
                            disabled={isLoading}
                            value={newItemValue}
                            onChange={e => {
                                setBody(e.target.value);
                                setNewItemValue(e.target.value);
                            }}
                        />
                    </div>
                </div>

                {!isAddingMode && (
                    <button
                        name={addingItems}
                        className="plusBtn fade-in"
                        onClick={() => setIsAddingMode(true)}
                    >
                        &#43;
                    </button>
                )}
            </div>
            }
            {showCategoryModal &&
                <AddCategoryModal submit={insertCategory} isLoading={isLoading} setShowModal={setShowCategoryModal} />
            }
            {showModal &&
                <DescriptionModal item={activeItem} setShowModal={setShowModal} />
            }
        </>
    )
}