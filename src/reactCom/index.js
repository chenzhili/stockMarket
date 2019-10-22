import React from "react"
import ReactDOM from "react-dom"
import {browserRedirect} from "../utils"

import App from "./app"

/* 这中间 是 所有的 组件 */
const requireComponent = require.context("./pc", true, /.js$/);

console.log(requireComponent);
const device = browserRedirect();
/*  */
// const keyword = device === pcOrH5.pc ? "pc" : "h5";
requireComponent.keys().forEach(rc => {
    /* if (rc.split("/").find(item => item === keyword)) {
        const com = requireComponent(rc).default;
        console.log(com);
    } */
});







ReactDOM.render(<App />, document.getElementById("root"));