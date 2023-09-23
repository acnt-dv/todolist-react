import React, {useEffect, useState} from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";

const CATEGORIES = {
    DAILY_LIST: 0,
    SHOP_LIST: 1,
    TARGET_LIST: 2,
    BOOK_LIST: 3,
    ARCHIVE_LIST: 4,
    getCategoryName: (input) => {
        for (let [key, value] of Object.entries(CATEGORIES))
            if (input === value)
                return key;
        return false;
    }
}

const FA_CATEGORIES = {
    DAILY_LIST: 'لیست روزانه',
    SHOP_LIST: 'لیست خرید',
    TARGET_LIST: 'لیست اهداف',
    BOOK_LIST: 'لیست کتب',
    ARCHIVE_LIST: 'آرشیو',
    getFaCategoryName: (input) => {
        for (let [key, value] of Object.entries(FA_CATEGORIES))
            if (input === key)
                return value;
        return false;
    }
}

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
    const [isDone, setIsDone] = useState({
        "title": null,
        "body": null,
        "done": null,
        "category": null,
        "id": null
    });

    async function updateList(category) {
        setIsLoading(true);

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

        setIsLoading(false);
    }

    function deleteAllItems(category) {
        list.forEach(element => {
            deleteEntry(element);
        });
        //
        updateList(true);
    }

    async function addToList(category) {
        setNewItemValue('');

        let data = ({
            "title": title,
            "body": body,
            "done": false,
            "category": category
        });

        await insertItemToList(data);
        updateList(category);
    }

    async function updateDoneList() {
        await updateTheList(isDone);
        updateList(activeList);
    }

    useEffect(() => {
        if (isDone.id != null) {
            updateDoneList();
        }
    }, [isDone])

    useEffect(() => {
        updateList(CATEGORIES.DAILY_LIST);
    }, [])

    return (
        <div className="center-div">
            <div className="center-div-col">
                <table id="items">
                    <div>
                        <tr>
                            <th style={{textAlign: 'center'}} onClick={() => updateDoneList()}>وضعیت</th>
                            <th className="w-100">
                                <div className="row w-100">
                                    <div className="col col-10">
                                        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                                            <DropdownToggle style={{backgroundColor: 'none', width: '125px'}} caret>
                                                {listTitle}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {/* <DropdownItem header>Header</DropdownItem> */}
                                                {/* <DropdownItem disabled>Action</DropdownItem> */}
                                                {Object.entries(CATEGORIES).map((item, index) =>
                                                    <>
                                                        {index < Object.entries(CATEGORIES).length -1 &&
                                                        <DropdownItem onClick={() => {
                                                            setActiveList(index);
                                                            updateList(index);
                                                        }
                                                        } style={{textAlign: 'right'}}>
                                                            {FA_CATEGORIES.getFaCategoryName(CATEGORIES.getCategoryName(index))}
                                                        </DropdownItem>
                                                        }
                                                        {index < Object.entries(CATEGORIES).length -2 &&
                                                        <DropdownItem divider/>
                                                        }
                                                    </>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                    <div className="col col-2">
                                        <div className="d-flex justify-content-end align-items-center h-100 left-stick">
                                            <button className="fa fs-4 bg-transparent text-white" onClick={() => {
                                                updateList(activeList);
                                            }}>&#xf021;</button>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </div>
                    {isLoading ? <div className={`spinner-border text-info mt-5`} role="status"/> :
                        <div className="table-body">
                            {list && list.map(x =>
                                <tr key={x.id} className="container-fluid">
                                    <td style={{minWidth: '106px'}}>
                                        <input
                                            type={'checkbox'}
                                            checked={x.done === 'true'}
                                            onChange={e => setIsDone(
                                                {
                                                    "title": x.title,
                                                    "body": x.body,
                                                    "done": e.target.checked,
                                                    "id": parseInt(x.id)
                                                })
                                            }>
                                        </input>
                                    </td>
                                    <td className="w-100">
                                        <div className="d-flex justify-content-between">
                                            {x.body}
                                            {isArchived &&
                                            <button
                                                className="btn btn-transparent text-danger fs-6 m-1 d-flex justify-content-start align-items-center text-center"
                                                style={{width: '15px', height: '15px'}}
                                                onClick={() => {
                                                    deleteEntry({id: x.id});
                                                    updateList(true);
                                                }}>
                                                &#10006;
                                            </button>}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </div>
                    }
                </table>
                {isArchived ?
                    <div className="center-div-row">
                        <p className="fa trashBtn left-stick d-flex"
                           onClick={() => deleteAllItems()}>&#xf014;{/*&#94;*/}</p>
                    </div>
                    :
                    <div className="center-div-row">
                        <div className="submissionForm">
                            <input value={newItemValue} onChange={e => {
                                setBody(e.target.value);
                                setNewItemValue(e.target.value)
                            }}/>
                            <button onClick={() => addToList(activeList)}>&#8682;{/*&#94;*/}</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;