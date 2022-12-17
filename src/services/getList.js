import React from "react";
import axios from "axios";

export default async function getList(){
    let test = 'test'
    let config = {
        method: 'get',
        url: 'http://192.198.84.243:8081/getList',
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