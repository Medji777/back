import {Request, Response} from "express";
import {blogsQueryRepository, postsQueryRepository, QueryPosts} from "../repositories/query";
import {postsService} from "../domain";
import {Paginator, RequestWithParams, RequestWithParamsAndBody, Statuses} from "../types/types";
import {PostInputModel, PostsViewModel} from "../types/posts";
import {commentsQueryRepository} from "../repositories/query/commentsQuery";
import {CommentViewModel} from "../types/comments";
import {commentsService} from "../domain/comments.service";

export const getPosts = async (
    req: Request,
    res: Response<Paginator<PostsViewModel>>): Promise<void> => {
    const posts = await postsQueryRepository.getAll(req.query as unknown as QueryPosts)
    res.status(Statuses.OK).send(posts)
}

export const getPostOnId = async (
    req: RequestWithParams<{id: string}>,
    res: Response<PostsViewModel>) => {
    const post = await postsQueryRepository.findById(req.params.id);
    if(!post) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(post)
}

export const createPost = async (req: Request,res: Response<PostsViewModel>) => {
    const blog = await blogsQueryRepository.findById(req.body.blogId);
    if(!blog){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    const post = await postsService.create({
        ...req.body,
        blogName: blog.name
    });
    res.status(Statuses.CREATED).send(post)
}

export const updatePost = async (
    req: RequestWithParamsAndBody<{id: string}, PostInputModel>,
    res: Response)=>{
    const isUpdated = await postsService.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deletePost = async (
    req: RequestWithParams<{id: string}>,
    res: Response)=>{
    const isDeleted = await postsService.delete(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const createCommentByPost = async (req:Request,res:Response<CommentViewModel>) => {
    const post = await postsQueryRepository.findById(req.params.id);
    if(!post) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }

    const comment = await commentsService.create({
        ...req.body,
        postId: post.id,
        userId: req.user!.id,
        userLogin: req.user!.login
    })

    res.status(Statuses.CREATED).send(comment)
}

export const getCommentByPost = async (req:Request,res:Response<Paginator<CommentViewModel>>) => {
    const post = await postsQueryRepository.findById(req.params.id);
    if(!post) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }

    const comments = await commentsQueryRepository
        .getCommentsByPostId(req.params.id,req.query as unknown as QueryPosts);

    res.status(Statuses.OK).send(comments)
}