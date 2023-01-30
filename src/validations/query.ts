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
        .customSanitizer((v: keyof typeof SortDirections)=>{
            return !!v &&!SortDirections[v] ? SortDirections.desc : SortDirections[v]
        })
        .default(SortDirections.desc),
    query('sortDirection').default(SortDirections.desc)
]

export const validatePaginationQuery = [
    query('pageNumber')
        .optional()
        .customSanitizer((v)=>{
            return !v || !isNaN(+v) && +v === 0 || isNaN(+v) ? 1 : v
        }).default(1).toInt(),
    query('pageNumber').default(1).toInt(),
    query('pageSize')
        .optional()
        .customSanitizer((v)=>{
            return !v || !isNaN(+v) && +v === 0 || isNaN(+v) ? 10 : v
        }).default(10).toInt(),
    query('pageSize').default(10).toInt()
]