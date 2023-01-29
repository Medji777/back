import {query} from "express-validator";
import {SortDirections} from "../types/types";

export const validateSearchNameTermQuery = [
    query('searchNameTerm')
        .optional({
            nullable: true,
        })
        .trim(),
    query('searchNameTerm').default(null)
]

export const validateSortQuery = [
    query('sortBy')
        .optional()
        .trim(),
    query('sortBy').default('createdAt'),
    query('sortDirection')
        .optional()
        .trim()
        .custom((v: keyof typeof SortDirections)=>{
            if(!!v &&!SortDirections[v]){
                throw new Error(`field not valid`)
            }
            return true
        }).default(SortDirections.desc),
]

export const validatePaginationQuery = [
    query('pageNumber')
        .optional()
        .isInt({min:1}).withMessage('field not valid'),
    query('pageNumber').default(1).toInt(),
    query('pageSize')
        .optional()
        .isInt({min:10}).withMessage('field not valid'),
    query('pageSize').default(10).toInt()
]