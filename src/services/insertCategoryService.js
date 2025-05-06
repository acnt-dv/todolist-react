import axios from 'axios';
import {SERVER_ADDRESS} from '../config';

export default async function insertCategoryService(input) {
    let response = '';
    let data = new FormData();
    data.append('category', input.category);

    let config = {
        method: 'post',
        url: `${SERVER_ADDRESS}/buildCategory`,
        headers: {},
        data: data
    };
    console.log('update config', config);
    await axios(config)
        .then(function (response) {
            response = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
    return response;
}
