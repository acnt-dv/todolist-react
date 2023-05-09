import axios from "axios";
import { SERVER_ADDRESS } from '../config';

export default async function getList(){
    let test = 'test'
    let config = {
        method: 'get',
        url: `${SERVER_ADDRESS}/getList`,
        headers: { }
    };

    await axios(config)
        .then(function (response) {
            test =  JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
        return test
}