import test from "tape";
import ed from "../src/index";
import _ from "lodash";

class Base extends ed.Object{
    constructor(){
        super();
        this.a = undefined;
    }
};

test( "throw when accessing inexisting field", t=>{
    t.plan(2);
    const a = new Base();
    t.ok(_.isUndefined(a.a));
    t.throws(()=>a.b,Error);
    t.end();
});
