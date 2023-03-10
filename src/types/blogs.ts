import {ObjectId} from "mongodb";

export type BlogsViewModel = {
    _id?: ObjectId
    id:	string
    name: string
    description: string
    websiteUrl:	string
    createdAt?: string
    isMembership?: boolean
}

export type BlogsInputModel = {
    name: string
    description: string
    websiteUrl: string
}