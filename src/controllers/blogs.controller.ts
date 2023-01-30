import {Request, Response} from "express";
import {blogsQueryRepository, postsQueryRepository, QueryBlogs, QueryPosts} from "../repositories/query";
import {blogsService,postsService} from "../domain";
import {
    Paginator,
    RequestWithParams,
    RequestWithBody,
    RequestWithParamsAndQuery,
    RequestWithParamsAndBody,
    Statuses, SortDirections,
} from "../types/types";
import {BlogsInputModel, BlogsViewModel} from "../types/blogs";
import {PostInputModel, PostsViewModel} from "../types/posts";
import * as queryString from "querystring";

export const getBlogs = async (req: Request,res: Response<Paginator<BlogsViewModel>>) => {
    const blogs = await blogsQueryRepository.getAll(req.query as unknown as QueryBlogs);
    res.status(Statuses.OK).send(blogs)
}

export const getBlogOnId = async (
    req: RequestWithParams<{id: string}>,
    res: Response<BlogsViewModel>) => {
    const blog = await blogsQueryRepository.findById(req.params.id);
    if(!blog) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(blog)
}

export const createBlog = async (
    req: RequestWithBody<BlogsInputModel>,
    res: Response<BlogsViewModel>) => {
    const blog = await blogsService.create(req.body);
    res.status(Statuses.CREATED).send(blog)
}

export const updateBlog = async (
    req: RequestWithParamsAndBody<{id: string}, BlogsInputModel>,
    res: Response)=>{
    const isUpdated = await blogsService.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteBlog = async (req: RequestWithParams<{id: string}>,res: Response)=>{
    const isDeleted = await blogsService.delete(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const getPostByBlogIdWithQuery = async (
    req: RequestWithParamsAndQuery<{blogId: string}, any>,
    res: Response<Paginator<PostsViewModel>>) => {
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepository.findById(blogId);
    if(!blog) {
        return res.sendStatus(Statuses.NOT_FOUND);
    }

    const posts = await postsQueryRepository.getPostsByBlogId(blogId,req.query)
    res.status(Statuses.OK).send(posts)
}

export const createPostForBlogId = async (
    req: RequestWithParamsAndBody<{blogId: string}, PostInputModel>,
    res: Response<PostsViewModel>) => {
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepository.findById(blogId);
    if(!blog) {
        return res.sendStatus(Statuses.NOT_FOUND);
    }

    const post = await postsService.create({
        ...req.body,
        blogId,
        blogName: blog.name
    })

    res.status(Statuses.CREATED).send(post)
}