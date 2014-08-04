/**
 * Created by zhanglingkang on 2014/7/30.
 */
"use strict";
(function () {
    mocha.setup('bdd');
    chai.Should();

    describe("ky", function () {
        describe("template", function () {
            it("if条件为true的时候，输出if语句块的内容", function () {
                var tpl = document.querySelector("#if-true").text;
                ky.template(tpl, null).trim().should.eql("if-true");
            });
            it("if条件为false的时候，输出else语句块的内容", function () {
                var tpl = document.querySelector("#if-false").text;
                ky.template(tpl, null).trim().should.eql("if-false");
            });
            it("for循环测试", function () {
                var tpl = document.querySelector("#for").text,
                    view = ky.template(tpl, null).trim();
                view.should.contain("0");
                view.should.contain("5");
                view.should.contain("9");
            });
            it("表达式内调用函数时，输出函数的返回结果", function () {
                var tpl = document.querySelector("#exp-fn").text,
                    view = ky.template(tpl, {
                        fn: function () {
                            return "123";
                        }}).trim();
                view.should.eql("123");
            });
            it("访问未定义变量时，应自动输出为空", function () {
                var tpl = document.querySelector("#var-undefined").text,
                    view = ky.template(tpl).trim();
                view.should.eql("");
            });
            it("表达式值为undefined时，应自动输出为空", function () {
                var tpl = document.querySelector("#value-undefined").text,
                    view = ky.template(tpl).trim();
                view.should.eql("");
            });
            it("表达式值为null时，应自动输出为空", function () {
                var tpl = document.querySelector("#value-null").text,
                    view = ky.template(tpl).trim();
                view.should.eql("");
            });
            it("表达式值为false时，应输出为false", function () {
                var tpl = document.querySelector("#value-false").text,
                    view = ky.template(tpl).trim();
                view.should.eql("false");
            });
            it("表达式值为0时，应输出为0", function () {
                var tpl = document.querySelector("#value-0").text,
                    view = ky.template(tpl).trim();
                view.should.eql("0");
            });
        });
    });
    mocha.run();
}());
