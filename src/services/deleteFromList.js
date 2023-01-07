import axios from 'axios';
import * as FormData from "form-data";

export default async function deleteEntry(input) {
    let response = '';
    let data = new FormData();
    data.append('id', input.id);
    var config = {
        method: 'post',
        url: 'http://162.248.243.38:8081/deleteFromList',
        headers: {
        },
        data: data
    };
    // console.log('delete config', config);
    await axios(config)
        .then(function (response) {
            response = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    return response;
}
