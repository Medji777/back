import {ObjectId} from "mongodb";

export type PostsViewModel = {
    _id?: ObjectId,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt?: string
}

export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId:	string
}

export type BlogName = {
    blogName: string
}