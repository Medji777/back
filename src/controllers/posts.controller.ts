import {Request, Response} from "express";
import {postsRepository} from "../repositories";
import {RequestWithParams, Statuses} from "../types/types";
import {BlogName, PostInputModel} from "../types/posts";
import {blogsQueryRepository, postsQueryRepository, QueryPosts} from "../repositories/query";

export const getPosts = async (req: Request,res: Response) => {
    const posts = await postsQueryRepository.getAll(req.query as unknown as QueryPosts)
    res.status(Statuses.OK).send(posts)
}

export const getPostOnId = async (req: RequestWithParams<{id: string}>,res: Response) => {
    const post = await postsQueryRepository.findById(req.params.id);
    if(!post) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(post)
}

export const createPost = async (req: Request,res: Response) => {
    const blog = await blogsQueryRepository.findById(req.body.blogId);
    if(!blog){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    const payload: PostInputModel & BlogName = {
        ...req.body,
        blogName: blog.name
    };
    const post = await postsRepository.create(payload);
    res.status(Statuses.CREATED).send(post)
}

export const updatePost = async (req: Request,res: Response)=>{
    const payload: PostInputModel = req.body
    const isUpdated = await postsRepository.update(req.params.id,payload);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deletePost = async (req: Request,res: Response)=>{
    const isDeleted = await postsRepository.deleteById(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}