import React, { useEffect, useState } from "react";
import insertItemToList from "../services/addToList";
import getList from "../services/getList";
import * as FormData from "form-data";
import updateTheList from "../services/updateList";

function Home() {

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

    async function updateList() {
        let myList = JSON.parse(await getList());
        setList(myList.filter(x => x.done === 'false'));
    }

    async function addToList() {
        setNewItemValue('');

        var data = ({
            "title": title,
            "body": body,
            "done": false
        });

        await insertItemToList(data);
        updateList();
    }

    async function updateDoneList() {
        var data = isDone;
        await updateTheList(data);
        updateList();
    }

    useEffect(() => {
        if (isDone.id != null)
            updateDoneList();
    }, [isDone])

    useEffect(() => {
        updateList();
    }, [])

    return (
        <div className="center-div">
            <div className="center-div-col">
                {/* <h1>To-Do List</h1> */}
                <table id="items">
                    <tr>
                        <th>Done</th>
                        <th>Title</th>
                        <th>Body</th>
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
                            <td className="width-md">{x.title}</td>
                            <td className="width-lg">{x.body}</td>
                        </tr>
                    )}
                </table>
                <div className="center-div-row">
                    <div className="submitionform">
                    <input className="" value={newItemValue} onChange={e => {setBody(e.target.value); setNewItemValue(e.target.value)}}></input>
                        <button onClick={() => addToList()}>&#43;</button>
                    </div>
                </div>
                {/* <div className="center-div-row">
                    <div className="full">
                    <input className="textbox" value={newItemValue} onChange={e => {setBody(e.target.value); setNewItemValue(e.target.value)}}></input>
                    <button className="submitBtn" onClick={() => addToList()}>&#43;</button>
                    </div>
                    { <input className="width-md textbox" onChange={e => setTitle(e.target.value)}></input> }
                </div> */}
            </div>
        </div>
    );
}
export default Home;