import {Router} from "express";
import {getUsers, createUser, deleteUser, getUsersTest} from "../controllers/users.controller";
import {basicAuthMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {createSearchTermQuery, validatePaginationQuery, validateSortQuery} from "../validations/query";
import {SearchTermQuery} from "../types/types";
import {validateBodyUser} from "../validations";

export const usersRouter = Router({});

const sanitizationBodyUser = sanitizationBody(['login','email','password'])
const validateSearchLoginTermQuery = createSearchTermQuery(SearchTermQuery.searchLoginTerm)
const validateSearchEmailTermQuery = createSearchTermQuery(SearchTermQuery.searchEmailTerm)

const validateQuery = validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery,
    ...validateSearchLoginTermQuery,
    ...validateSearchEmailTermQuery
])

usersRouter.get('/',basicAuthMiddleware,validateQuery,getUsers)
usersRouter.post('/',basicAuthMiddleware,sanitizationBodyUser,validateBodyUser,createUser)
usersRouter.delete('/:id',basicAuthMiddleware,deleteUser)
usersRouter.get('/tests',basicAuthMiddleware,getUsersTest)