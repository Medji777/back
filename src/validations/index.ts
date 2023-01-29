import {body, ValidationChain} from "express-validator";
import {APIErrorResult, FieldError, Resolutions} from "../types/types";
import {equalSize} from "../utils";
import {validateMiddleware} from "../middlewares";
import {blogsQueryRepository} from "../repositories/query";

export const isNotValidString = (val:any,size:number=0):boolean => !val || typeof val !== 'string' || !val.trim() || (!size ? false : val.length > size);
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

export const validateBodyBlog = validateMiddleware([
    body('name')
        .isString().withMessage('input is string')
        .trim().escape()
        .notEmpty().withMessage('input is required')
        .isLength({max: 15}).withMessage('input is max 15 symbol'),
    body('description')
        .isString().withMessage('input is string')
        .trim().escape()
        .notEmpty().withMessage('input is required')
        .isLength({max: 500}).withMessage('input is max 500 symbol'),
    body('websiteUrl')
        .trim()
        .notEmpty().withMessage('input is required')
        .isURL({ protocols: ['https'] })
        .withMessage('input is URL')
        .isLength({max: 100}).withMessage('input is max 100 symbol')
])

export const validatorBlogId = body('blogId')
    .isString().withMessage('input is string')
    .trim()
    .notEmpty().withMessage('input is required')
    .custom(async (blogId)=>{
        const blog = await blogsQueryRepository.findById(blogId);
        if(!blog){
            throw new Error('blog with this id don\'t exist in the DB')
        }
        return true
    })

export const validateBodyPost = (...validationChains: Array<ValidationChain>) => validateMiddleware([
    body('title')
        .isString().withMessage('input is string')
        .trim().escape()
        .notEmpty().withMessage('input is required')
        .isLength({max: 30}).withMessage('input is max 30 symbol'),
    body('shortDescription')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({max: 100}).withMessage('input is max 100 symbol'),
    body('content')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({max: 1000}).withMessage('input is max 1000 symbol'),
    ...validationChains
]);