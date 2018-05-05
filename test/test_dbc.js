import test from "tape";
import ed from "../src/index";

class MyException{
};

class Sample{
    constructor(target){
        this.target = target;
    }

    setTarget(target){
        this.target = target;
    }

    __check_and_throw(v){
        if( this.target == v ){
            throw new MyException();
        }
    }

    __invariant__(){
        this.__check_and_throw( "__invariant__" );
    }
    __pre_a(){
        this.__check_and_throw( "__pre_a" );
    }
    __post_a(){
        this.__check_and_throw( "__post_a" );
    }

    a(){
        this.__check_and_throw( "a" );
    }
}

ed.dbc(Sample);

test( "ed.dbc: design by contact", t=>{
  t.plan(3);
  const c = new Sample("a");
  t.throws( ()=>c.a(), MyException );
  c.setTarget( "__pre_a" );
  t.throws( ()=>c.a(), MyException );
  c.setTarget( "__post_a" );
  t.throws( ()=>c.a(), MyException );
  // c.setTarget( "__invariant__" );
  // t.throws( ()=>c.a(), MyException );
  t.end();
});
