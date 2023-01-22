import {Request, Response} from "express";
import {blogsRepository} from "../repositories";
import {Statuses} from "../types/types";
import {BlogsInputModel} from "../types/blogs";

export const getBlogs = async (req: Request,res: Response) => {
    const blogs = await blogsRepository.getAll();
    res.status(Statuses.OK).send(blogs)
}

export const getBlogOnId = async (req: Request,res: Response) => {
    const blog = await blogsRepository.findById(req.params.id);
    if(!blog) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(blog)
}

export const createBlog = async (req: Request,res: Response) => {
    const payload: BlogsInputModel = req.body;
    const blog = await blogsRepository.create(payload);
    res.status(Statuses.CREATED).send(blog)
}

export const updateBlog = async (req: Request,res: Response)=>{
    const isUpdated = await blogsRepository.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteBlog = async (req: Request,res: Response)=>{
    const isDeleted = await blogsRepository.deleteById(req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}