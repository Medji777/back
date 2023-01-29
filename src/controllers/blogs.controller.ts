import {Request, Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";
import {
    Paginator,
    RequestWithParams,
    RequestWithBody,
    Statuses,
    RequestWithParamsAndQuery,
} from "../types/types";
import {BlogsInputModel} from "../types/blogs";
import {PostsViewModel} from "../types/posts";
import {blogsQueryRepository, postsQueryRepository, QueryBlogs, QueryPosts} from "../repositories/query";

export const getBlogs = async (req: Request,res: Response) => {
    const blogs = await blogsQueryRepository.getAll(req.query as unknown as QueryBlogs);
    res.status(Statuses.OK).send(blogs)
}

export const getBlogOnId = async (req: RequestWithParams<{id: string}>,res: Response) => {
    const blog = await blogsQueryRepository.findById(req.params.id);
    if(!blog) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(blog)
}

export const createBlog = async (req: RequestWithBody<BlogsInputModel>,res: Response) => {
    const blog = await blogsRepository.create(req.body);
    res.status(Statuses.CREATED).send(blog)
}

export const updateBlog = async (req: Request,res: Response)=>{
    const isUpdated = await blogsRepository.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteBlog = async (req: RequestWithParams<{id: string}>,res: Response)=>{
    const isDeleted = await blogsRepository.deleteById(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const getPostByBlogIdWithQuery = async (
    req: RequestWithParamsAndQuery<{blogId: string},{}>,
    res: Response<Paginator<PostsViewModel>>) => {
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepository.findById(blogId);
    if(!blog) {
        return res.status(Statuses.NOT_FOUND);
    }

    const posts = await postsQueryRepository.getPostsByBlogId(blogId,req.query as unknown as QueryPosts)
    res.status(Statuses.OK).send(posts)
}

export const createPostForBlogId = async (req: Request,res: Response) => {
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepository.findById(blogId);
    if(!blog) {
        return res.status(Statuses.NOT_FOUND);
    }

    const post = await postsRepository.create({
        ...req.body,
        blogId,
        blogName: blog.name
    })

    res.status(Statuses.CREATED).send(post)
}