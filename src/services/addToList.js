import axios from 'axios';
import * as FormData from "form-data";

export default async function insertItemToList(input) {
    let response = '';
    let data = new FormData();
    data.append('title', input.title);
    data.append('body', input.body);
    data.append('done', input.done);
    var config = {
        method: 'post',
        url: 'http://localhost:8081/insertIntoList',
        headers: {
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            response = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    return response;
}
