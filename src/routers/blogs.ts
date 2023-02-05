import {Router} from "express";
import {ValidationChain} from "express-validator";
import {basicAuthMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {
    createBlog, createPostForBlogId,
    deleteBlog,
    getBlogOnId,
    getBlogs,
    getPostByBlogIdWithQuery,
    updateBlog
} from "../controllers/blogs.controller";
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

blogsRouter.get('/',validateQuery(validateSearchNameTermQuery),getBlogs)
blogsRouter.get('/:id',getBlogOnId)
blogsRouter.post('/',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,createBlog)
blogsRouter.put('/:id',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,updateBlog)
blogsRouter.delete('/:id',basicAuthMiddleware,deleteBlog)
blogsRouter.get('/:blogId/posts',validateQuery(),getPostByBlogIdWithQuery)
blogsRouter.post(
    '/:blogId/posts',
    basicAuthMiddleware,
    sanitizationBodyPostByBlog,
    validateBodyPost(),
    createPostForBlogId
)