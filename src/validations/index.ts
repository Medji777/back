import {APIErrorResult, FieldError, Resolutions} from "../types/types";
import {equalSize} from "../utils";

export const isNotValidString = (val:any,size:number=0):boolean => !val || !val.trim() || typeof val !== 'string' || (!size ? false : val.length > size);
export const isNotValidResolution = (res:Array<Resolutions>) => !res.length || !equalSize(res) || !res.every((v:Resolutions)=>Resolutions[v]);
export const bodyFieldValidator = (body: any): APIErrorResult | null => {

    const errors: Array<FieldError> = [];

    const {title,author,availableResolutions,canBeDownloaded,minAgeRestriction,publicationDate} = body;

    if(isNotValidString(title,40)){
        errors.push({message: 'invalid field', field: 'title'})
    }

    if(isNotValidString(author,20)){
        errors.push({message: 'invalid field', field: 'author'})
    }

    if(availableResolutions && isNotValidResolution(availableResolutions)) {
        errors.push({message: 'invalid field', field: 'availableResolutions'})
    }

    if(canBeDownloaded && typeof canBeDownloaded !== 'boolean') {
        errors.push({message: 'invalid field', field: 'canBeDownloaded'})
    }

    if(typeof minAgeRestriction === 'number' && !(minAgeRestriction >= 1 && minAgeRestriction <= 18)){
        errors.push({message: 'invalid field', field: 'minAgeRestriction'})
    }

    if(publicationDate && (isNotValidString(publicationDate) || isNaN(Date.parse(publicationDate)))){
        errors.push({message: 'invalid field', field: 'publicationDate'})
    }

    return errors.length ? ({errorsMessages: errors}) : null
}