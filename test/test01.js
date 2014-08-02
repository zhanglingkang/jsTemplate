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
        });
    });
    mocha.run();
}());
