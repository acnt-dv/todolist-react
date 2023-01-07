import React from "react";
import axios from "axios";

export default async function getList(){
    let test = 'test'
    let config = {
        method: 'get',
        url: 'http://162.248.243.38:8081/getList',
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