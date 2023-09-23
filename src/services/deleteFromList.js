import axios from 'axios';
import * as FormData from "form-data";
import {SERVER_ADDRESS} from '../config';

export default async function deleteEntry(input) {
    let response = '';
    let data = new FormData();

    data.append('id', input.id);

    let config = {
        method: 'post',
        url: `${SERVER_ADDRESS}/deleteFromList`,
        headers: {},
        data: data
    };
    console.log('delete config', config);
    await axios(config)
        .then(function (response) {
            response = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    return response;
}
