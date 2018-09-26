import test from "tape";
import ed from "../src/index";

test( "assert", t=>{
    t.plan(2);
    t.throws(()=>ed.assert(false), Error );
    t.doesNotThrow(()=>ed.assert(true));
    t.end();
});
