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

    var EXPRESSION_REG = /<%=([^%>]+)%>/;
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
     * @method templateFn 有些场景下，一份模板可能需要渲染多个视图，调用此函数，可以将解析后的模板缓存起来，防止重复解析。
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
         * CODE_REG在tpl中的某一匹配结果
         * @type {Array}
         */
        var matchResult;
        /**
         * CODE_REG在tpl中的某一匹配部分
         * @type {String}
         */
        var matchPart;
        /**
         * 模板lastPos之前的代码已被解析。
         * @type {number}
         */
        var lastPos = 0;
        /**
         * 模板的长度
         * @type {Number}
         */
        var length = tpl.length;
        /**
         * 放入eval中执行的代码。
         * @type {string}
         */
        var evalCode = "";
        /**
         * EXPRESSION_REG在tpl中的某一匹配部分
         * @type {Array}
         */
        var expressionMatchResult;
        /**
         * 放入eval中的执行的代码片段。
         * @type {String}
         */
        var evalCodePiece;

        while (true) {
            matchResult = CODE_REG.exec(tpl);
            if (matchResult == null) {
                evalCodePiece = "view.push('{content}');".replace("{content}", tpl.substring(lastPos, length).replace(/\n/g, ""));
                evalCode += evalCodePiece;
                break;
            } else {
                matchPart = tpl.substring(matchResult.index, CODE_REG.lastIndex);
                evalCodePiece = "view.push('{content}');".replace("{content}", tpl.substring(lastPos, matchResult.index).replace(/\n/g, ""));
                evalCode += evalCodePiece;
                lastPos = CODE_REG.lastIndex;
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
                    evalCode += matchPart.substring(2, matchPart.length - 2);
                }
            }
        }
        console.log(evalCode);
        return function (data) {
            /**
             * view.join("")为模板与数据结合后渲染成的视图
             * @type {Array}
             */
            var view = [];
            /**
             * 保存data的键值。
             * @type {String}
             */
            var key;
            /**
             * 增加parsedCode变量是为了保持evalCode不随着此函数的调用改变
             * @type {String}
             */
            var parsedCode = evalCode;
            data = data || {};
            for (key in data) {
                //将data的keys作为变量定义在eval函数内。
                if (data.hasOwnProperty(key)) {
                    parsedCode = "var key=data.key;".replace(/key/g, key) + parsedCode;
                }
            }
            (function () {
                eval(parsedCode);//这里将eval放入立即函数内是为了防止在非严格模式下eval内代码干扰调用者函数内的变量。
            }());
            return view.join("");
        };
    };
}());
