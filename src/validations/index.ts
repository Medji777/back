import {body, ValidationChain} from "express-validator";
import {APIErrorResult, FieldError, LikeStatus, Resolutions} from "../types/types";
import {equalSize} from "../utils";
import {validateMiddleware} from "../middlewares/validateMiddleware";
import {usersQueryRepository, blogsQueryRepository} from '../composition-root';

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

export const validationConfirmation = validateMiddleware([
    body('code')
        .trim()
        .custom(async (code)=>{
            const user = await usersQueryRepository.getUserByCode(code);
            if(!user){
                throw new Error('user with this code don\'t exist in the DB')
            }
            if(user.emailConfirmation.isConfirmed){
                throw new Error('email is already confirmed')
            }
            const expirationDate = user.emailConfirmation.expirationDate;
            if (expirationDate && expirationDate < new Date()) {
                throw new Error('code expired')
            }
            return true
        })
])

export const validationConfirmed = validateMiddleware([
    body('email')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isEmail().withMessage('Not valid email field')
        .custom(async (email)=>{
            const user = await usersQueryRepository.getUserByLoginOrEmail(email);
            if(!user){
                throw new Error('user with this id don\'t exist in the DB')
            }
            if(user.emailConfirmation.isConfirmed){
                throw new Error('email is already confirmed')
            }
            return true
        })
])

export const validationPasswordRecovery = validateMiddleware([
    body('email')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isEmail().withMessage('Not valid email field')
])

export const validationNewPassword = validateMiddleware([
    body('recoveryCode')
        .trim()
        .custom(async (code)=>{
            const user = await usersQueryRepository.getUserByRecoveryCode(code);
            if(!user){
                throw new Error('user with this code don\'t exist in the DB')
            }
            const expirationDate = user.passwordConfirmation.expirationDate;
            if (expirationDate && expirationDate < new Date()) {
                throw new Error('code expired')
            }
            return true
        }),
    body('newPassword')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({min: 6, max: 20}).withMessage('input is min 6 and max 20 symbol'),
])

export const validateBodyUser = validateMiddleware([
    body('login')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({min: 3, max: 10}).withMessage('input is min 3 and max 10 symbol')
        .custom((v)=>{
            const regExp = new RegExp('^[a-zA-Z0-9_-]*$')
            if(!regExp.test(v)){
                throw new Error('Not valid login field')
            }
            return true
        }),
    body('password')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({min: 6, max: 20}).withMessage('input is min 6 and max 20 symbol'),
    body('email')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isEmail().withMessage('Not valid email field')
])

export const validateExistUserOnEmailOrLogin = validateMiddleware([
    body(['login','email'])
        .custom(async (input)=>{
            const user = await usersQueryRepository.getUserByLoginOrEmail(input);
            if(user){
                throw new Error('User already registration')
            }
            return true
        })
])

export const validateBodyLogin = validateMiddleware([
    body('loginOrEmail')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required'),
    body('password')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
])

export const validatorBodyContent = validateMiddleware([
    body('content')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({min: 20, max: 300}).withMessage('input is min 20 and max 300 symbol')
])

export const validatorBodyLikes = validateMiddleware([
    body('likeStatus')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .custom((v: LikeStatus) => {
            if(!LikeStatus[v]) {
                throw new Error(`${v} not include in ${Object.values(LikeStatus).toString()}`)
            }
            return true
        })
])