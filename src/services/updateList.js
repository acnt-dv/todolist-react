import axios from 'axios';
import * as FormData from "form-data";

export default async function updateTheList(input) {
    let response = '';
    let data = new FormData();
    data.append('title', input.title);
    data.append('body', input.body);
    data.append('done', input.done);
    data.append('id', input.id)
    var config = {
        method: 'post',
        url: 'http://localhost:8081/updateList',
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
