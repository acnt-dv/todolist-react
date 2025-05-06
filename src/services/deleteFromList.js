import axios from 'axios';
import {SERVER_ADDRESS} from '../config';

export default async function deleteEntry(input) {
    let response = '';
    let data = new FormData();

    data.append('id', input.id);
    data.append('category', input.category);

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
