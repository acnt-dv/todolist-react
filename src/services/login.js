import axios from 'axios';
import {SERVER_ADDRESS} from '../config';

export default async function login(input) {
    let result = '';
    let data = new FormData();
    data.append('userName', input?.username);
    data.append('password', input?.password);

    let config = {
        method: 'post',
        url: `${SERVER_ADDRESS}/login`,
        headers: {},
        data: data
    };
    console.log('update config', config);
    await axios(config)
        .then(function (response) {
            result = (response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
    return result;
}
