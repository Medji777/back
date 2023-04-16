import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {
    QueryPosts,
    QueryComments,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository
} from "../repositories/query";
import {
    Paginator, RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    Statuses
} from "../types/types";
import {PostInputModel, PostsViewModel} from "../types/posts";
import {CommentInputModel, CommentViewModel} from "../types/comments";
import {LikeInputModel} from "../types/likes";
import {PostsService, CommentsService} from "../services";

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {}
    async getPosts(req: Request, res: Response<Paginator<PostsViewModel>>){
        const posts = await this.postsQueryRepository.getAll(req.query as unknown as QueryPosts, req.user?.id)
        res.status(Statuses.OK).send(posts)
    }
    async getPostOnId(req: RequestWithParams<{id: string}>, res: Response<PostsViewModel>){
        const post = await this.postsQueryRepository.findById(req.params.id, req.user?.id);
        if(!post) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(post)
    }
    async createPost(req: RequestWithBody<PostInputModel>, res: Response<PostsViewModel>){
        const blog = await this.blogsQueryRepository.findById(req.body.blogId);
        if(!blog){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        const post = await this.postsService.create({
            ...req.body,
            blogName: blog.name
        });
        res.status(Statuses.CREATED).send(post)
    }
    async updatePost(req: RequestWithParamsAndBody<{id: string}, PostInputModel>, res: Response){
        const isUpdated = await this.postsService.update(req.params.id,req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deletePost(req: RequestWithParams<{id: string}>, res: Response){
        const isDeleted = await this.postsService.delete(req.params.id)
        if(!isDeleted){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async createCommentByPost(req:RequestWithParamsAndBody<{id: string}, CommentInputModel>, res:Response<CommentViewModel>){
        const post = await this.postsQueryRepository.findById(req.params.id, req.user?.id);
        if(!post) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        const comment = await this.commentsService.create({
            ...req.body,
            postId: post.id,
            userId: req.user!.id,
            userLogin: req.user!.login
        })
        res.status(Statuses.CREATED).send(comment)
    }
    async getCommentByPost(req:RequestWithParamsAndQuery<{id: string}, any>, res:Response<Paginator<CommentViewModel>>){
        const post = await this.postsQueryRepository.findById(req.params.id, req.user?.id);
        if(!post) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        const comments = await this.commentsQueryRepository
            .getCommentsByPostId(req.params.id,req.query as unknown as QueryComments,req.user?.id);
        res.status(Statuses.OK).send(comments)
    }
    async updateStatusLike(req: RequestWithParamsAndBody<{id: string}, LikeInputModel>, res: Response){
        const updatedPostLike = await this.postsService.updateStatusLike(
            req.user!.id,
            req.user!.login,
            req.params.id,
            req.body
        )
        if (!updatedPostLike) {
            res.sendStatus(Statuses.NOT_FOUND)
            return
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
}