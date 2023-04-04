import {Router} from "express";
import {ValidationChain} from "express-validator";
import {basicAuthMiddleware, getUserMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {blogsController} from "../controllers";
import {validateBodyBlog, validateBodyPost} from "../validations";
import {validatePaginationQuery, validateSortQuery, createSearchTermQuery} from "../validations/query";
import {SearchTermQuery} from "../types/types";

const sanitizationBodyBlogs = sanitizationBody(['name','description','websiteUrl'])
const sanitizationBodyPostByBlog = sanitizationBody(['title','shortDescription','content'])

const validateQuery = (validate: Array<ValidationChain> = []) => validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery,
    ...validate
])

const validateSearchNameTermQuery = createSearchTermQuery(SearchTermQuery.searchNameTerm)

export const blogsRouter = Router({});

blogsRouter.get('/',
    validateQuery(validateSearchNameTermQuery),
    blogsController.getBlogs.bind(blogsController)
)
blogsRouter.get('/:id',blogsController.getBlogOnId.bind(blogsController))
blogsRouter.post('/',
    basicAuthMiddleware,
    sanitizationBodyBlogs,
    validateBodyBlog,
    blogsController.createBlog.bind(blogsController)
)
blogsRouter.put('/:id',
    basicAuthMiddleware,
    sanitizationBodyBlogs,
    validateBodyBlog,
    blogsController.updateBlog.bind(blogsController)
)
blogsRouter.delete('/:id',basicAuthMiddleware,blogsController.deleteBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts',
    getUserMiddleware,
    validateQuery(),
    blogsController.getPostByBlogIdWithQuery.bind(blogsController)
)
blogsRouter.post(
    '/:blogId/posts',
    basicAuthMiddleware,
    sanitizationBodyPostByBlog,
    validateBodyPost(),
    blogsController.createPostForBlogId.bind(blogsController)
)