import _ from "lodash";

let siDisableUndefinedPropertyCheck = 0;

let saExpectedFailedProperties = [];

function isExpectedFailedProperty( strKey ){
    const keys = saExpectedFailedProperties[ siDisableUndefinedPropertyCheck ];
    if( keys == null ){
        return true;
    }else{
        return !_.isUndefined( _.find( keys, v=>v==strKey ) );
    }
}

const baseProxy = new Proxy( {}, {
    get : function(target, strKey, receiver){
        if( Reflect.has(target,strKey) ){
            return Reflect.get(target, strKey);
        }else{
            if( ( siDisableUndefinedPropertyCheck > 0 ) && isExpectedFailedProperty(strKey) ){
                return undefined;
            }
            const errorObject = new Error( "Unexisted key " + strKey );
            console.log( "Undefined key ", strKey, " in ", target, " with ", errorObject.stack );  
            throw errorObject;
        }
    }
});

export default function EdObject(){}

EdObject.prototype = baseProxy;

EdObject.funcMakeNoCheckUndefinedProperty = function(func){
    return function(...args){
        try{
            ++siDisableUndefinedPropertyCheck;
            return func(...args);
        }finally{
            --siDisableUndefinedPropertyCheck;
        }
    };
};

EdObject.callWithoutCheckUndefinedProperty = function( func, aExpectProperty, ...args ){
    try{
        ++siDisableUndefinedPropertyCheck;
        saExpectedFailedProperties.push( aExpectProperty );
        return func(...args);
    }
    finally{
        saExpectedFailedProperties.pop();
        --siDisableUndefinedPropertyCheck;
    }
};
