/**
 * Created by zhanglingkang on 2014/8/4.
 * 性能测试
 */
(function () {
    var t = ky.template,
        tfn = ky.templateFn,
        tpl = document.querySelector("#if-true").text,
        fn,
        i,
        j,
        templates;
    console.log("重复解析-------");
    templates = document.querySelectorAll("[type='text/template']");
    console.time("10000");
    for (i = 0; i < templates.length; ++i) {
        for (j = 0; j < 10000; ++j) {
            t(templates[i].text);
        }
    }
    console.timeEnd("10000");


    console.log("一次解析-------");
    console.time("10000");
    for (i = 0; i < templates.length; ++i) {
        fn = tfn(templates[i].text);
        for (j = 0; j < 10000; ++j) {
            fn();
        }
    }
    console.timeEnd("10000");
}());