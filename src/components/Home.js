import React, {useEffect, useState} from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import {CATEGORIES, FA_CATEGORIES} from "../utilities/enums/categories";

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

    function handleKeyPress(event) {
        if (event.charCode === 13) {
            setIsLoading(false);
            addToList(activeList).then(() => setIsLoading(false));
        }
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

    return (
        <div className="center-div" onKeyPress={(e) => {
            handleKeyPress(e)
        }}>
            <div className="center-div-col">
                <table id="items">
                    <div>
                        <tr>
                            <th style={{textAlign: 'center'}}>وضعیت</th>
                            <th className="w-100">
                                <div className="row w-100">
                                    <div className="col col-10">
                                        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
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
                                    <div className="col col-2">
                                        <div className="d-flex justify-content-end align-items-center h-100 left-stick">
                                            <button className="fa fs-4 bg-transparent text-white" onClick={() => {
                                                changeList(activeList);
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
                                                        setIsLoading(true);
                                                        deleteEntry({id: x.id});
                                                        updateList(true).then(() => setIsLoading(false));
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