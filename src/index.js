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

const modules = {
    assert: edassert,
}

export default modules;
