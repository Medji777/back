import {query, ValidationChain} from "express-validator";
import {SortDirections} from "../types/types";

const sortDirectionSanitizer = (v: keyof typeof SortDirections)=>{
    return !v || !!v && !SortDirections[v] ? SortDirections.desc : SortDirections[v]
}
const numberSanitizer = (defaultValue: number) => (v: string)=>{
    return !v || !isNaN(+v) && +v === 0 || isNaN(+v) ? defaultValue : v
}

export const createSearchTermQuery = (fieldName: string): Array<ValidationChain> => ([
    query(fieldName)
        .optional({
            nullable: true,
        })
        .trim(),
    query(fieldName).default(null)
])

export const validateSortQuery = [
    query('sortBy')
        .optional()
        .trim(),
    query('sortBy').default('createdAt'),
    query('sortDirection')
        .optional()
        .trim()
        .customSanitizer(sortDirectionSanitizer)
        .default(SortDirections.desc),
    query('sortDirection').default(SortDirections.desc)
]

export const validatePaginationQuery = [
    query('pageNumber')
        .optional()
        .customSanitizer(numberSanitizer(1))
        .default(1).toInt(),
    query('pageNumber').default(1).toInt(),
    query('pageSize')
        .optional()
        .customSanitizer(numberSanitizer(10))
        .default(10).toInt(),
    query('pageSize').default(10).toInt()
]