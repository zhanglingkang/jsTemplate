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
     * @return {String} 模板与数据结合后最终生成的代码
     */
    ky.template = function (tpl, data) {
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
         * view.join("")为模板与数据结合后渲染成的视图
         * @type {Array}
         */
        var view = [];
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
        /**
         * 保存data的键值。
         * @type {String}
         */
        var key;

        for (key in data) {
            //将data的keys作为变量定义在eval函数内。
            if (data.hasOwnProperty(key)) {
                evalCodePiece = "var key=data.key;".replace(/key/g, key);
                evalCode += evalCodePiece;
            }
        }
        while (true) {
            matchResult = CODE_REG.exec(tpl);
            if (matchResult == null) {
                evalCodePiece = "view.push(tpl.substring(lastPos, length));".replace("lastPos", lastPos);
                evalCodePiece = evalCodePiece.replace("length", length);
                evalCode += evalCodePiece;
                break;
            } else {
                matchPart = tpl.substring(matchResult.index, CODE_REG.lastIndex);
                evalCodePiece = "view.push(tpl.substring(lastPos, matchResult.index));".replace("lastPos", lastPos);
                evalCodePiece = evalCodePiece.replace("matchResult.index", matchResult.index);
                evalCode += evalCodePiece;
                lastPos = CODE_REG.lastIndex;
                if (expressionMatchResult = matchPart.match(EXPRESSION_REG)) {
                    evalCode += "view.push({prop});".replace("{prop}", expressionMatchResult[1]);
                } else {
                    evalCode += matchPart.substring(2, matchPart.length - 2);
                }
            }
        }
        (function () {
            eval(evalCode);//这里为作用域链多添加一层是为了防止在非严格模式下evalCode代码干扰template函数内的变量。
        }());
        return view.join("");
    }
}());
