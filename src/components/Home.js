import React, {useEffect, useRef, useState} from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import {CATEGORIES, FA_CATEGORIES} from "../utilities/enums/categories";
import ReactPullToRefresh from 'react-pull-to-refresh';
import SwipeToDelete from 'react-swipe-to-delete-ios';
import emptyImg from '../assets/images/empty.jpg';
import {DescriptionModal} from "./Modals/DescriptionModal";
import getLists from "../services/getLists";

function Home() {
    const [isArchived, setIsArchived] = useState(false);
    const [list, setList] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('body');
    const [newItemValue, setNewItemValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [activeList, setActiveList] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [isDone, setIsDone] = useState({
        "title": null,
        "body": null,
        "done": null,
        "category": null,
        "id": null
    });

    const inputRef = useRef(null);

    async function addToList(category) {
        setIsLoading(true);
        setNewItemValue('');

        let data = ({
            "category": category,
            "body": body
        });

        await insertItemToList(data);
        updateList(category).then(() => setIsLoading(false));
    }

    async function updateList(category) {
        let listItems = JSON.parse(await getList(category))?.data;
        setList(listItems);
        setActiveList(category);
        setIsArchived(false);
    }

    function deleteAllItems() {
        setIsLoading(true);

        list.forEach(element => {
            deleteEntry(element);
        });

        updateList(CATEGORIES.ARCHIVE_LIST).then(() => setIsLoading(false));
    }

    function changeList(category) {
        setIsLoading(true);
        setActiveList(category);
        updateList(category).then(() => setIsLoading(false));
    }

    function handleKeyPress(event) {
        console.log('clicked')
        if (event.charCode === 13) {
            setIsLoading(false);
            addToList(activeList).then(() => {setIsLoading(false); inputRef.current.focus()});
        }
    }

    async function handleRefresh() {
        setIsLoading(true);
        updateList(activeList).then(() => setIsLoading(false));
    }

    function handleSwipeToDelete(x) {
        if (isArchived) {
            // deleteEntry(x)
        } else {
            setIsDone(
                {
                    // "title": x.title,
                    // "body": x.body,
                    // "done": true,
                    "category": activeList,
                    "id": parseInt(x.id)
                })
        }
    }

    function handleItemClicked(item) {
        setActiveItem(item.items);
        setShowModal(true);

        console.log('here', item)
    }

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

    useEffect(() => {
        setIsLoading(true);
        getCategoryList().then((firstItem) => updateList(firstItem).then(() => setIsLoading(false)));

        inputRef.current.focus();
        inputRef.current.select();
    }, []);

    useEffect(() => {
        if (isDone.id != null) {
            setIsLoading(true);
            updateTheList(isDone).then(() =>
                updateList(activeList).then(() => setIsLoading(false)));
        }

    }, [isDone]);

    useEffect(() => {
        setIsDisable(isLoading);
        console.log('here')
        inputRef.current.select();
        inputRef.current.focus();

    }, [isLoading]);

    const handleFocus =( event) => {
        console.log('focused')
        event.current.focus();
        event.target.select();
    }

    return (
        <div className="center-div" onKeyPress={(e) => {
            handleKeyPress(e);
        }}>
            <div className="center-div-col">
                <table id="items">
                    <tr>
                        <th className="w-100">
                            <div className="row w-100">
                                <div className="col col-12">
                                    <Dropdown disabled={isDisable} isOpen={dropdownOpen}
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
                                                    {/*{index < Object.entries(CATEGORIES).length - 1 &&*/}
                                                    <DropdownItem onClick={() => {
                                                        changeList(item);
                                                    }
                                                    } style={{textAlign: 'right'}}>
                                                        {item}
                                                    </DropdownItem>
                                                    {/*}*/}
                                                    {/*{index < Object.entries(CATEGORIES).length - 2 &&*/}
                                                    {/*<DropdownItem divider/>*/}
                                                    {/*}*/}
                                                </>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </th>
                    </tr>
                    {isLoading &&
                    <div className='loaderStyle'>
                        <div className={`spinner-border spinner-border-lg  mt-5`}
                             style={{width: '125px', height: '125px', color: '#046D'}} role="status"/>
                    </div>
                    }

                    <ReactPullToRefresh onRefresh={handleRefresh}>
                        {list && list.length < 1 && <img src={emptyImg} style={{maxWidth: '100%'}}/>}
                        {list && list.map((item, index) =>
                            item.isDone === 0 &&
                            <SwipeToDelete
                                onDelete={() => handleSwipeToDelete(item)}
                                height={50}
                                transitionDuration={250}
                                deleteWidth={75}
                                deleteThreshold={75}
                                showDeleteAction={true}
                                deleteColor="rgba(252, 58, 48, 1.00)"
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
                            </SwipeToDelete>
                        )}
                    </ReactPullToRefresh>
                </table>
                {isArchived ?
                    <div className="center-div-row">
                        <p className="fa trashBtn left-stick d-flex"
                           onClick={() => deleteAllItems()}>&#xf014;{/*&#94;*/}</p>
                    </div>
                    :
                    <div className="center-div-row" onClick={() => {

                        inputRef.current.focus()
                    }

}>
                        <div className="submissionForm">
                            <input ref={inputRef}
                                   autoFocus
                                   onFocus={handleFocus}
                                   disabled={isDisable} value={newItemValue} onChange={e => {
                                setBody(e.target.value);
                                setNewItemValue(e.target.value);
                            }}/>
                            <button disabled={isDisable}
                                    onClick={() => addToList(activeList)}
                                    style={{borderRadius: '5px'}}>&#10148;{/*&#94;*/}</button>
                        </div>
                    </div>
                }
                {showModal &&
                <DescriptionModal item={activeItem} setShowModal={setShowModal}/>
                }
            </div>
        </div>
    );
}

export default Home;