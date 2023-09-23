import React, {useEffect, useState} from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import {CATEGORIES, FA_CATEGORIES} from "../utilities/enums/categories";
import ReactPullToRefresh from 'react-pull-to-refresh';
import SwipeToDelete from 'react-swipe-to-delete-ios';

function Home() {
    const [listTitle, setListTitle] = useState('لیست خرید');
    const [isArchived, setIsArchived] = useState(false);
    const [list, setList] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('body');
    const [newItemValue, setNewItemValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState();
    const [activeList, setActiveList] = useState(CATEGORIES.DAILY_LIST);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [isDone, setIsDone] = useState({
        "title": null,
        "body": null,
        "done": null,
        "category": null,
        "id": null
    });

    async function addToList(category) {
        setIsLoading(true);
        setNewItemValue('');

        let data = ({
            "title": title,
            "body": body,
            "done": false,
            "category": category
        });

        await insertItemToList(data);
        updateList(category).then(() => setIsLoading(false));
    }

    async function updateList(category) {
        let myList = JSON.parse(await getList());

        if (category === true || category === CATEGORIES.ARCHIVE_LIST) {
            setList(myList.filter(x => x.done === true.toString()))
            setListTitle(FA_CATEGORIES.getFaCategoryName(CATEGORIES.getCategoryName(category)));
            setIsArchived(true);
        } else {
            setList(myList.filter(x => x.category === category.toString()));
            setIsArchived(false);
            setListTitle(FA_CATEGORIES.getFaCategoryName(CATEGORIES.getCategoryName(category)));
        }
    }

    function deleteAllItems() {
        setIsLoading(true);

        list.forEach(element => {
            deleteEntry(element);
        });

        updateList(true).then(() => setIsLoading(false));
    }

    function changeList(category) {
        setIsLoading(true);
        setActiveList(category);
        updateList(category).then(() => setIsLoading(false));
    }

    function handleKeyPress(event) {
        if (event.charCode === 13) {
            setIsLoading(false);
            addToList(activeList).then(() => setIsLoading(false));
        }
    }

    async function handleRefresh() {
        setIsLoading(true);
        updateList(activeList).then(() => setIsLoading(false));
    }

    function handleSwipeToDelete(x) {
        if (isArchived) {
            deleteEntry(x)
        } else {
            setIsDone(
                {
                    "title": x.title,
                    "body": x.body,
                    "done": true,
                    "id": parseInt(x.id)
                })
        }
    }

    useEffect(() => {
        setIsLoading(true);
        updateList(CATEGORIES.DAILY_LIST).then(() => setIsLoading(false));
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
    }, [isLoading]);

    return (
        <div className="center-div" onKeyPress={(e) => {
            handleKeyPress(e)
        }}>
            <div className="center-div-col">
                <table id="items">
                    <tr>
                        <th className="w-100">
                            <div className="row w-100">
                                <div className="col col-12">
                                    <Dropdown disabled={isDisable} isOpen={dropdownOpen}
                                              toggle={() => setDropdownOpen(!dropdownOpen)}>
                                        <DropdownToggle style={{backgroundColor: 'none', width: '125px'}} caret>
                                            {listTitle}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {Object.entries(CATEGORIES).map((item, index) =>
                                                <>
                                                    {index < Object.entries(CATEGORIES).length - 1 &&
                                                        <DropdownItem onClick={() => {
                                                            changeList(index);
                                                        }
                                                        } style={{textAlign: 'right'}}>
                                                            {FA_CATEGORIES.getFaCategoryName(CATEGORIES.getCategoryName(index))}
                                                        </DropdownItem>
                                                    }
                                                    {index < Object.entries(CATEGORIES).length - 2 &&
                                                        <DropdownItem divider/>
                                                    }
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
                            <div className={`spinner-border spinner-border-lg  mt-5`} style={{width: '125px', height: '125px', color: '#046D'}} role="status"/>
                        </div>
                    }

                    <ReactPullToRefresh onRefresh={handleRefresh}>
                        {list && list.map((item, index) =>
                            <SwipeToDelete
                                onDelete={() => handleSwipeToDelete(item)} // required
                                // optional
                                height={50} // default
                                transitionDuration={250} // default
                                deleteWidth={75} // default
                                deleteThreshold={75} // default
                                showDeleteAction={true} //default
                                deleteColor="rgba(252, 58, 48, 1.00)" // default
                                deleteText="Done" // default
                                // deleteComponent={<DeleteComponent/>} // not default
                                disabled={false} // default
                                id="swiper-1" // not default
                                className="my-swiper" // not default
                                rtl={false} // default
                                // onDeleteConfirm={(onSuccess, onCancel) => {
                                //     // not default - default is null
                                //     if (window.confirm("Do you really want to delete this item ?")) {
                                //         onSuccess();
                                //     } else {
                                //         onCancel();
                                //     }
                                // }}
                            >
                                <tr key={item.id} className={index % 2 === 0 ? "tableOdd" : "tableNormal"}>
                                    <td className="w-100">
                                        {item.body}
                                        {/*{isArchived &&*/}
                                        {/*    <button*/}
                                        {/*        disabled={}*/}
                                        {/*        className="btn btn-transparent text-light fs-6 m-1 d-flex justify-content-start align-items-center text-center"*/}
                                        {/*        style={{width: '15px', height: '15px'}}*/}
                                        {/*        onClick={() => {*/}
                                        {/*            setIsLoading(true);*/}
                                        {/*            deleteEntry({id: item.id});*/}
                                        {/*            updateList(true).then(() => setIsLoading(false));*/}
                                        {/*        }}>*/}
                                        {/*        &#10006;*/}
                                        {/*    </button>}*/}
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
                    <div className="center-div-row">
                        <div className="submissionForm">
                            <input disabled={isDisable} value={newItemValue} onChange={e => {
                                setBody(e.target.value);
                                setNewItemValue(e.target.value)
                            }}/>
                            <button disabled={isDisable}
                                    onClick={() => addToList(activeList)}>&#8682;{/*&#94;*/}</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;