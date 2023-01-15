import {Request, Response} from "express";
import {postsRepository} from "../repositories";
import {Statuses} from "../types/types";
import {PostInputModel} from "../types/posts";

export const getPosts = (req: Request,res: Response) => {
    const posts = postsRepository.getAll()
    res.status(Statuses.OK).send(posts)
}

export const getPostOnId = (req: Request,res: Response) => {
    const post = postsRepository.findById(req.params.id);
    if(!post) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(post)
}

export const createPost = (req: Request,res: Response) => {
    const payload: PostInputModel = req.body
    const post = postsRepository.create(payload);
    res.status(Statuses.CREATED).send(post)
}

export const updatePost = (req: Request,res: Response)=>{
    const payload: PostInputModel = req.body
    const isUpdated = postsRepository.update(req.params.id,payload);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deletePost = (req: Request,res: Response)=>{
    const isDeleted = postsRepository.deleteById(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}