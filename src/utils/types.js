function judge(type){
    return (value)=>{
        type = `${type.slice(0,1).toUpperCase()}${type.slice(1)}`
        return Object.prototype.toString.call(value) === `[object ${type}]`
    }
}
export const isString = judge("String");
export const isNumber = judge("Number");
export const isBoolean = judge("Boolean");
export const isArray = judge("Array");
export const isObject = judge("Object");
export const isFunction = judge("Function");
export const isNull = judge("Null");
export const isUndefined = judge("Undefined");