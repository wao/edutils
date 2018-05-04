import test from "tape";
import _ from "lodash";

class MyException{
};

class Sample{
    constructor(target){
        this.target = target;
    }

    setTarget(target){
        this.target = target;
    }

    check_and_throw(v){
        if( this.target == v ){
            throw new MyException();
        }
    }

    __invariant__(){
        this.check_and_throw( "__invariant__" );
    }
    __pre_a(){
        this.check_and_throw( "__pre_a" );
    }
    __post_a(){
        this.check_and_throw( "__post_a" );
    }

    a(){
        this.check_and_throw( "a" );
    }
}

function dbc(class_object){
    console.log( _(class_object.prototype).keys().reject(_.partialRight( _.startsWith, "__")).toArray() );
}

dbc(Sample);

test( "ed.dbc: design by contact", t=>{
    const c = new Sample("a");
    t.throws( ()=>c.a(), MyException );
    c.setTarget( "__pre_a" );
    t.throws( ()=>c.a(), MyException );
    t.end();
});
