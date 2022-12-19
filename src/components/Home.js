import React, { useEffect, useState } from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import * as FormData from "form-data";
import updateTheList from "../services/updateList";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'reactstrap';
import deleteEntry from "../services/deleteFromList";

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
                    <div>
                        <tr>
                            <th style={{ textAlign: 'center' }} onClick={() => updateDoneList()}>وضعیت</th>
                            {/* <th>Title</th> */}
                            <th className="w-100">
                                <div className="row w-100">
                                    <div className="col col-10">
                                        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                                            <DropdownToggle style={{ backgroundColor: 'none', width: '125px' }} caret>
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
                                    <div className="col col-2">
                                        <div className="d-flex justify-content-end align-items-center h-100 left-stick">
                                            <button className="fa fs-4 text-white" onClick={() => { updateList(false); }}>&#xf021;</button>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </div>
                    <div className="table-body">
                        {list && list.map(x =>
                            <tr key={x.id} className="container-fluid" >
                                <td style={{ minWidth: '106px' }}>
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
                                <td className="w-100">
                                    <div className="d-flex justify-content-between">
                                        {x.body}
                                        {isArchieved &&
                                            <button
                                                className="btn btn-transparent text-danger fs-6 m-1 d-flex justify-content-start align-items-center text-center"
                                                style={{ width: '15px', height: '15px' }}
                                                onClick={() => { deleteEntry({ id: x.id }); updateList(true); }}>
                                                &#10006;
                                            </button>}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </div>
                </table>
                {isArchieved ?
                    <div className="center-div-row">
                         <span className="fa text-danger trashBtn left-stick d-flex justify-content-start" onClick={() => {}}>&#xf014;{/*&#94;*/}</span>
                    </div> 
                    :
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