import {NextFunction, Request, Response} from "express";
import {ValidationChain, validationResult, ValidationError} from "express-validator";
import {APIErrorResult, FieldError, Statuses} from "../types/types";

export const validateMiddleware = (validations: Array<ValidationChain>,onlyFirstError: boolean = true) => async (req:Request,res:Response,next:NextFunction) => {

    await Promise.all(validations.map(validation => validation.run(req)));

    const errorFormatter = ({ msg, param }: ValidationError): FieldError => {
        return ({
            message: msg,
            field: param
        });
    };

    const errors = validationResult(req).formatWith(errorFormatter);
    if (errors.isEmpty()) {
        return next();
    }

    const errorBody: APIErrorResult = { errorsMessages: errors.array({ onlyFirstError }) }

    res.status(Statuses.BAD_REQUEST).send(errorBody);
}