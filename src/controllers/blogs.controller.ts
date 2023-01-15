import {Request, Response} from "express";
import {blogsRepository} from "../repositories";
import {Statuses} from "../types/types";
import {BlogsInputModel} from "../types/blogs";

export const getBlogs = (req: Request,res: Response) => {
    const blogs = blogsRepository.getAll()
    res.status(Statuses.OK).send(blogs)
}

export const getBlogOnId = (req: Request,res: Response) => {
    const blog = blogsRepository.findById(req.params.id);
    if(blog) {
        res.status(Statuses.OK).send(blog)
    } else {
        res.sendStatus(Statuses.NOT_FOUND)
    }
}

export const createBlog = (req: Request,res: Response) => {
    const payload: BlogsInputModel = req.body
    const blog = blogsRepository.create(payload);
    res.status(Statuses.CREATED).send(blog)
}

export const updateBlog = (req: Request,res: Response)=>{
    const isUpdated = blogsRepository.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteBlog = (req: Request,res: Response)=>{
    const isDeleted = blogsRepository.deleteById(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}