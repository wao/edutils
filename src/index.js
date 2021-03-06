import _ from "lodash";
import EdObject from "./ed_object";

export function edassert(expr){
    let result = expr;
    if( typeof expr == "function" ){
        result = expr();
    }
    if( !result ){
        const stackOfError = (new Error( "" )).stack.split("\n");
        const location = "Assert Failed " + (stackOfError[2].trim());
        console.error( location );
        throw new Error( location );
    }
}

function nop(){}

function methodOrNop(proto, methodName){
    if( methodName in proto ){
        return proto[methodName];
    }else{
        return nop;
    }
}

function chainMethod(proto, methodName){
  const inv = methodOrNop( proto, "__invariant" ); 
  const pre = methodOrNop( proto, "__pre_" + methodName );
  const post =methodOrNop( proto, "__post_" + methodName );
  const org = proto[methodName];

  // console.log( "methods", pre, post, org );

  if( methodName == "constructor" ){
    proto.constructor = function(...argv){ const ret = org.apply( this, argv ); inv.apply(this); return ret; };
  }else{
    proto[methodName] = function(...argv){ inv.apply(this); pre.apply(this, argv ); const ret = org.apply( this, argv ); inv.apply(this); post.apply( this, [ ret ].concat( argv ) ); return ret; };
  }
}

export function dbc(class_object){
  // if( ! class_object.prototype.__has_dbc__ ){
    _(Object.getOwnPropertyNames(class_object.prototype)).reject(n=>_.startsWith(n,"__")).each(methodName=>chainMethod(class_object.prototype, methodName));
    // class_object.prototype.__has_dbc__ = true;
  // }
}

const modules = {
    assert: edassert,
    dbc: dbc,
    Object: EdObject,
}

export default modules;
