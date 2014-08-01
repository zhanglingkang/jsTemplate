/**
 * Created by zhanglingkang on 2014/7/30.
 */
"use strict";
(function () {
    var tpl = document.querySelector("#hello-tpl"),
        container = document.querySelector("#container"),
        data = {
            name: "zlk",
            age: 23,
            persons: [
                {
                    name: "zlk"
                },
                {
                    name: "zhuqian"
                },
                {
                    name: "liuhcao"
                }
            ]
        },
        view = ky.template(tpl.text, data);
    container.innerHTML = view;

})();