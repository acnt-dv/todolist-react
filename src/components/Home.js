import React, { useEffect, useState } from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import * as FormData from "form-data";
import updateTheList from "../services/updateList";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function Home() {

    let [listTiltle, setListTitle] = useState('لیست خرید');
    let [isArchieved, setIsArchieved] = useState(false);
    let [list, setList] = useState([]);
    let [title, setTitle] = useState('');
    let [body, setBody] = useState('body');
    let [isDone, setIsDone] = useState({
        "title": null,
        "body": null,
        "done": null,
        "id": null
    });
    let [newItemValue, setNewItemValue] = useState('');

    let [dropdownOpen, setDropdownOpen] = useState();

    async function updateList(isDone) {
        let myList = JSON.parse(await getList());
        setList(myList.filter(x => x.done === isDone.toString()));
        if (isDone == true) {
            setListTitle('آرشیو');
            setIsArchieved(true);
        } else {
            setIsArchieved(false);
            setListTitle('لیست خرید');
        }
    }

    async function addToList() {
        setNewItemValue('');

        var data = ({
            "title": title,
            "body": body,
            "done": false
        });

        await insertItemToList(data);
        updateList(false);
    }

    async function updateDoneList() {
        var data = isDone;
        await updateTheList(data);
        updateList(false);
    }

    useEffect(() => {
        if (isDone.id != null) {
            updateDoneList();
        }
    }, [isDone])

    useEffect(() => {
        updateList(false);
    }, [])

    return (
        <div className="center-div">
            <div className="center-div-col">
                {/* <h1>To-Do List</h1> */}
                <table id="items">
                    <tr>
                        <th style={{ textAlign: 'center' }} onClick={() => updateDoneList()}>وضعیت</th>
                        {/* <th>Title</th> */}
                        <th>
                            <div className="row w-100">
                                <div className="col col-11">
                                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                                        <DropdownToggle caret>
                                            {listTiltle}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {/* <DropdownItem header>Header</DropdownItem> */}
                                            {/* <DropdownItem disabled>Action</DropdownItem> */}
                                            <DropdownItem onClick={() => { updateList(false); }} style={{ textAlign: 'right' }}>لیست خرید</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={() => { updateList(true); }} style={{ textAlign: 'right' }}>آرشیو</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="col col-1">
                                    <button className="fs-4" onClick={() => { updateList(false); }}>&#9842;</button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    {list && list.map(x =>
                        <tr key={x.id} >
                            <td className="width-sm">
                                <input
                                    type={'checkbox'}
                                    checked={x.done === 'true' ? true : false}
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
                            {/* <td className="width-md">{x.title}</td> */}
                            <td className="width-lg">{x.body}</td>
                        </tr>
                    )}
                </table>
                {isArchieved ? null :
                    <div className="center-div-row">
                        <div className="submitionform">
                            <input value={newItemValue} onChange={e => { setBody(e.target.value); setNewItemValue(e.target.value) }}></input>
                            <button onClick={() => addToList()}>&#8682;{/*&#94;*/}</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
export default Home;