import {Router} from "express";
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
import {validatePaginationQuery, validateSearchNameTermQuery, validateSortQuery} from "../validations/query";
import {ValidationChain} from "express-validator";

const sanitizationBodyBlogs = sanitizationBody(['name','description','websiteUrl'])
const sanitizationBodyPostByBlog = sanitizationBody(['title','shortDescription','content'])

const validateQuery = (validate: Array<ValidationChain> = []) => validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery,
    ...validate
])

export const blogsRouter = Router({});

blogsRouter.get('/blogs',validateQuery(validateSearchNameTermQuery),getBlogs)
blogsRouter.get('/blogs/:id',getBlogOnId)
blogsRouter.post('/blogs',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,createBlog)
blogsRouter.put('/blogs/:id',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,updateBlog)
blogsRouter.delete('/blogs/:id',basicAuthMiddleware,deleteBlog)
blogsRouter.get('/blogs/:blogId/posts',validateQuery(),getPostByBlogIdWithQuery)
blogsRouter.post(
    '/blogs/:blogId/posts',
    basicAuthMiddleware,
    sanitizationBodyPostByBlog,
    validateBodyPost(),
    createPostForBlogId
)