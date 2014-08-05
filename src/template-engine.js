"use strict";

var global = (function () {
    return this || (0, eval)("this");
}());

(function () {
    /**
     * 为了使用yuidoc生成文档。这里才声明成了class。
     * @class ky
     */
    var ky = global.ky = {

    };

    /**
     * 模版数据输出或者方法输出的匹配
     * @type {RegExp}
     */
    var EXPRESSION_REG = /<%=([^%>]+)%>/;

    /**
     * js 代码匹配，包含 EXPRESSION_REG 的情况在内
     * @type {RegExp}
     */
    var CODE_REG = /<%([^%>]+)%>/g;

    /**
     * @method template
     * @param tpl {String} 模板代码
     * @param data {Object} 填充至模板中的数据
     * @return {String} 模板与数据结合后最终生成的视图
     */
    ky.template = function (tpl, data) {
        return ky.templateFn(tpl)(data);
    };

    /**
     * 有些场景下，一份模板可能需要渲染多个视图，调用此函数，可以将解析后的模板缓存起来，防止重复解析
     * @method templateFn 模版缓存
     * @param tpl {String} 模板代码
     * @return {Function} 模板解析后的函数，需要一个参数模型数据 data {Object}，返回值为渲染后的视图
     * @example
     *   var tpl="<%=name%> say:hello!";
     *
     *   var fn=ky.templateFn(tpl);
     *
     *   fn({name:"zlk"});//结果zlk say:hello!
     */
    ky.templateFn = function (tpl) {
        /**
         * CODE_REG 在 tpl 中的每一次配结果
         * @type {Array}
         */
        var matchResult;

        /**
         * CODE_REG 在 tpl 中的每一次配结果匹配到的表达式
         * @type {String}
         */
        var matchPart;

        /**
         * EXPRESSION_REG 在 tpl 中的某一匹配部分
         * @type {Array}
         */
        var expressionMatchResult;

        /**
         * view.join("")为模板与数据结合后渲染成的视图
         * @type {Array}
         */
        var view = [];

        /**
         * 通过 exec 匹配的当前位置(模板 lastPos 之前的代码已被解析)
         * @type {number}
         */
        var lastPos = 0;

        /**
         * 模板的长度
         * @type {Number}
         */
        var length = tpl.length;

        /**
         * 存储放入 eval 中的执行的代码的临时片段
         * @type {String}
         */
        var evalCodePiece;

        /**
         * 最终放入 eval 中执行的代码
         * @type {string}
         */
        var evalCode = "";

        /**
         * 模板解析后的函数的函数体。
         * @tpye {String}
         */
        var fnBody;

        while (true) {
            matchResult = CODE_REG.exec(tpl);

            if (matchResult == null) {
                evalCodePiece = "view.push('{content}');".replace("{content}", tpl.substring(lastPos, length).replace(/\n/g, ""));
                evalCode += evalCodePiece;
                break;
            } else {
                // 截取第一段 js 输出代码
                matchPart = tpl.substring(matchResult.index, CODE_REG.lastIndex);

                // 截取从上一个匹配位置到下一个匹配位置间的模板代码
                evalCodePiece = "view.push('{content}');".replace("{content}", tpl.substring(lastPos, matchResult.index).replace(/\n/g, ""));
                evalCode += evalCodePiece;

                // 设置匹配结束位置
                lastPos = CODE_REG.lastIndex;

                // 匹配到输出表达式，将为其赋值的代码加到运行代码中
                if (expressionMatchResult = matchPart.match(EXPRESSION_REG)) {
                    evalCodePiece = [
                        "var value;",
                        "try{ ",
                        "value={expression};",
                        "}catch(e){",
                        "if(!(e instanceof ReferenceError)){",//屏蔽掉引用类型错误，访问未定义变量时，输出空。
                        "throw e;",
                        "}",
                        "}finally{",
                        "if(value===undefined||value===null){value='';}",
                        "view.push(value);",
                        "}"
                    ].join("").replace(/\{expression\}/g, expressionMatchResult[1]);
                    evalCode += evalCodePiece;
                } else {
                    // 匹配到 js 逻辑代码，直接加到运行代码中
                    evalCode += matchPart.substring(2, matchPart.length - 2);
                }
            }
        }

        fnBody = [
            "var view=[],",
                "_defineVarCode='',",
                "_key;",
            "for(_key in data) {",
                "_defineVarCode+='var key=data[\"key\"];'.replace(/key/g,_key);",
            "}",
            "eval(_defineVarCode);",
            evalCode,
            "return view.join('');"
        ].join("");

        console.log(fnBody);

        return new Function("data", fnBody);
    };
}());