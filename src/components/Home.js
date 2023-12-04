import React, {useEffect, useRef, useState} from "react";
import insertItemService from "../services/insertItemService";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import ReactPullToRefresh from 'react-pull-to-refresh';
import SwipeToDelete from 'react-swipe-to-delete-ios';
import emptyImg from '../assets/images/empty.jpg';
import {DescriptionModal} from "./Modals/DescriptionModal";
import getLists from "../services/getLists";
import {AddCategoryModal} from "./Modals/AddCategoryModal";
import insertCategoryService from "../services/insertCategoryService";
import deleteCategoryService from "../services/deleteCategoryService";

function Home() {

    const [list, setList] = useState([]);
    const [body, setBody] = useState('body');
    const [newItemValue, setNewItemValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [activeList, setActiveList] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [refresh, setRefresh] = useState(false);

    const inputRef = useRef(null);

    function insertCategory(category) {
        setIsLoading(true);
        insertCategoryService({
            "category": category,
        }).then(() => {
            setActiveList(category);
            reload();
        });
    }

    function deleteCategory() {
        setIsLoading(true);
        deleteCategoryService({
            "category": activeList
        }).then(() => {
            reload();
        });
    }

    function insertItem(category) {
        setIsLoading(true);
        setNewItemValue('');
        insertItemService({
            "category": category,
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
            let listItems = JSON.parse(await getList(category))?.data;
            listItems.sort(function compareByDone(a, b) {
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
            insertItem(activeList).then(() => {
                inputRef.current.focus();
                inputRef.current.select();
            });
        }
    }

    async function handleRefresh() {
        setRefresh(!refresh);
    }

    async function handleSwipeToDelete(x) {
        if (x.isDone === 1) {
            setIsLoading(true);
            deleteEntry({category: activeList, id: parseInt(x.id)}).then(() => setRefresh(!refresh));
        } else {
            setIsLoading(true);
            updateTheList({
                "category": activeList,
                "id": parseInt(x.id)
            }).then(() => setRefresh(!refresh));
        }
    }

    function handleItemClicked(item) {
        setActiveItem(item.items);
        setShowModal(true);
    }

    function reload(){
        async function getCategoryList() {
            let categories = [];
            let list = JSON.parse(await getLists())?.data;
            list.forEach(item => {
                categories.push(Object.values(item)?.[0]);
            });
            let firstItem = categories?.[0];
            setCategoryList(categories);
            setActiveList(firstItem);
            return firstItem;
        }

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
        setInterval(() => {
            setShowModal(false);
        }, 3500);

        reload();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setList([]);
        updateList(activeList).then(() => setIsLoading(false));
    }, [refresh]);

    return (
        <div className="center-div" onKeyPress={(e) => {
            handleKeyPress(e);
        }}>
            <div className="center-div-col">
                <table id="items">
                    <tr>
                        <th className="w-100">
                            <div className="row w-100">
                                <div className="d-flex">
                                    <Dropdown disabled={isLoading} isOpen={dropdownOpen}
                                              toggle={() => setDropdownOpen(!dropdownOpen)}>
                                        <DropdownToggle style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'white',
                                            width: '125px'
                                        }} caret>
                                            {activeList}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {categoryList && categoryList.length > 0 && categoryList.map((item, index) =>
                                                <>
                                                    <DropdownItem onClick={() => {
                                                        changeList(item);
                                                    }} style={{textAlign: 'right'}}>
                                                        {item}
                                                    </DropdownItem>
                                                </>
                                            )}
                                            <DropdownItem divider/>
                                            <DropdownItem onClick={() => {
                                                setShowCategoryModal(true);
                                            }} style={{textAlign: 'right', color: 'green'}}>
                                                <div className="d-flex" style={{maxHeight: '25px'}}>
                                                    <p style={{
                                                        padding: '0px',
                                                        textAlign: 'center',
                                                        marginLeft: '12px',
                                                        fontSize: '20px'
                                                    }}>&#43;</p>
                                                    <p style={{textAlign: 'center'}}>{'افزودن'}</p>
                                                </div>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <div className="">
                                        <p className="fa left-stick d-flex"
                                           style={{cursor: 'pointer', fontSize: '16px', marginTop: '11px', marginRight: '8px'}}
                                           onClick={() => deleteCategory()}>&#xf014;{/*&#94;*/}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </th>
                    </tr>

                    {isLoading &&
                    <div className='loaderStyle'>
                        <div className={`spinner-border spinner-border-lg  mt-5`}
                             style={{width: '125px', height: '125px', color: '#046D'}}
                             role="status"/>
                    </div>}

                    <ReactPullToRefresh onRefresh={handleRefresh}>
                        {list && (list.length < 1 && !isLoading) && <img alt={''} src={emptyImg} style={{maxWidth: '100%'}}/>}

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
                                        <td className="w-100" onClick={() => handleItemClicked(item)}>
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
                    </ReactPullToRefresh>
                </table>
                {showCategoryModal ?
                    <div/>
                    :
                    <div className="center-div-row">
                        <div className="submissionForm">
                            <input ref={inputRef}
                                   autoFocus
                                   disabled={isLoading} value={newItemValue} onChange={e => {
                                setBody(e.target.value);
                                setNewItemValue(e.target.value);
                            }}/>
                            <button disabled={isLoading}
                                    onClick={() => insertItem(activeList)}
                                    style={{borderRadius: '5px'}}>&#10148;{/*&#94;*/}</button>
                        </div>
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