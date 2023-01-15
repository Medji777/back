import {NextFunction, Request, Response} from "express";
import {ValidationChain, validationResult, ValidationError} from "express-validator";
import {APIErrorResult, FieldError} from "../types/types";

export const validateMiddleware = (validations: Array<ValidationChain>) => async (req:Request,res:Response,next:NextFunction) => {
    for (let validation of validations) {
        const result = await validation.run(req);
        // @ts-ignore
        if (result.errors.length) break;
    }

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

    const errorBody: APIErrorResult = { errorsMessages: errors.array() }

    res.status(400).send(errorBody);
}