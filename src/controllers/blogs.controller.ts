import {Request, Response} from "express";
import {blogsQueryRepository, postsQueryRepository, QueryBlogs} from "../repositories/query";
import {blogsService,postsService} from "../domain";
import {
    Paginator,
    RequestWithParams,
    RequestWithBody,
    RequestWithParamsAndQuery,
    RequestWithParamsAndBody,
    Statuses
} from "../types/types";
import {BlogsInputModel, BlogsViewModel} from "../types/blogs";
import {PostInputModel, PostsViewModel} from "../types/posts";

class BlogsController {
    async getBlogs(req: Request,res: Response<Paginator<BlogsViewModel>>){
        const blogs = await blogsQueryRepository.getAll(req.query as unknown as QueryBlogs);
        res.status(Statuses.OK).send(blogs)
    }
    async getBlogOnId(req: RequestWithParams<{id: string}>,res: Response<BlogsViewModel>){
        const blog = await blogsQueryRepository.findById(req.params.id);
        if(!blog) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(blog)
    }
    async createBlog(req: RequestWithBody<BlogsInputModel>,res: Response<BlogsViewModel>){
        const blog = await blogsService.create(req.body);
        res.status(Statuses.CREATED).send(blog)
    }
    async updateBlog(req: RequestWithParamsAndBody<{id: string}, BlogsInputModel>,res: Response){
        const isUpdated = await blogsService.update(req.params.id,req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deleteBlog(req: RequestWithParams<{id: string}>,res: Response){
        const isDeleted = await blogsService.delete(req.params.id)
        if(!isDeleted){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async getPostByBlogIdWithQuery(
        req: RequestWithParamsAndQuery<{blogId: string}, any>,
        res: Response<Paginator<PostsViewModel>>
    ){
        const blogId = req.params.blogId;
        const blog = await blogsQueryRepository.findById(blogId);
        if(!blog) {
            return res.sendStatus(Statuses.NOT_FOUND);
        }
        const posts = await postsQueryRepository.getPostsByBlogId(blogId,req.query,req.user?.id)
        res.status(Statuses.OK).send(posts)
    }
    async createPostForBlogId(
        req: RequestWithParamsAndBody<{blogId: string}, PostInputModel>,
        res: Response<PostsViewModel>
    ){
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
}

export const blogsController = new BlogsController()