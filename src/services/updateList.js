import axios from 'axios';
import * as FormData from "form-data";
import {SERVER_ADDRESS} from '../config';

export default async function updateTheList(input) {
    let response = '';
    let data = new FormData();

    data.append('id', input.id)
    // data.append('title', input.title);
    // data.append('body', input.body);
    // data.append('done', input.done);
    data.append('category', input.category);

    let config = {
        method: 'post',
        url: `${SERVER_ADDRESS}/updateList`,
        headers: {},
        data: data
    };

    console.log('update config', config);
    await axios(config)
        .then(function (response) {
            response = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    return response;
}
