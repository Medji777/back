export const equalSize = (a:Array<string|number>):boolean => {
    const filterArray = Array.from(new Set(a))
    return a.length === filterArray.length
}