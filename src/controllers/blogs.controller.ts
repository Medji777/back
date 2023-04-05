import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {QueryBlogs} from "../repositories/query";
import {BlogsService, PostsService} from "../domain";
import {BlogsQueryRepository, PostsQueryRepository} from "../repositories/query";
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

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
    ) {}
    async getBlogs(req: Request,res: Response<Paginator<BlogsViewModel>>){
        const blogs = await this.blogsQueryRepository.getAll(req.query as unknown as QueryBlogs);
        res.status(Statuses.OK).send(blogs)
    }
    async getBlogOnId(req: RequestWithParams<{id: string}>,res: Response<BlogsViewModel>){
        const blog = await this.blogsQueryRepository.findById(req.params.id);
        if(!blog) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(blog)
    }
    async createBlog(req: RequestWithBody<BlogsInputModel>,res: Response<BlogsViewModel>){
        const blog = await this.blogsService.create(req.body);
        res.status(Statuses.CREATED).send(blog)
    }
    async updateBlog(req: RequestWithParamsAndBody<{id: string}, BlogsInputModel>,res: Response){
        const isUpdated = await this.blogsService.update(req.params.id,req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deleteBlog(req: RequestWithParams<{id: string}>,res: Response){
        const isDeleted = await this.blogsService.delete(req.params.id)
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
        const blog = await this.blogsQueryRepository.findById(blogId);
        if(!blog) {
            return res.sendStatus(Statuses.NOT_FOUND);
        }
        const posts = await this.postsQueryRepository.getPostsByBlogId(blogId,req.query,req.user?.id)
        res.status(Statuses.OK).send(posts)
    }
    async createPostForBlogId(
        req: RequestWithParamsAndBody<{blogId: string}, PostInputModel>,
        res: Response<PostsViewModel>
    ){
        const blogId = req.params.blogId;
        const blog = await this.blogsQueryRepository.findById(blogId);
        if(!blog) {
            return res.sendStatus(Statuses.NOT_FOUND);
        }
        const post = await this.postsService.create({
            ...req.body,
            blogId,
            blogName: blog.name
        })
        res.status(Statuses.CREATED).send(post)
    }
}