import {Router} from "express";
import {container} from "../composition-root";
import {UsersController} from "../controllers";
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

const usersController = container.resolve(UsersController)

usersRouter.get('/',basicAuthMiddleware,validateQuery,usersController.getUsers.bind(usersController))
usersRouter.post('/',
    basicAuthMiddleware,
    sanitizationBodyUser,
    validateBodyUser,
    usersController.createUser.bind(usersController)
)
usersRouter.delete('/:id',basicAuthMiddleware,usersController.deleteUser.bind(usersController))
usersRouter.get('/tests',basicAuthMiddleware,usersController.getUsersTest.bind(usersController))