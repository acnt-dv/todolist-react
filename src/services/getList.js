import axios from "axios";
import {SERVER_ADDRESS} from '../config';

export default async function getList(category) {
    let list = ''

    let config = {
        method: 'get',
        url: `${SERVER_ADDRESS}/getList?category=${category}`,
        headers: {},
    };

    await axios(config)
        .then(function (response) {
            list = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    return list
}