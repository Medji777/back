import {model, Model, Schema} from "mongoose";
import {BlogsInputModel, BlogsViewModel} from "../types/blogs";

export type BlogsModelMethods = {
    update(payload: BlogsInputModel): void
}

export type BlogsModelType = Model<BlogsViewModel,{},BlogsModelMethods>

const blogsSchema = new Schema<BlogsViewModel,BlogsModelType,BlogsModelMethods>({
    id:	{type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl:	{type: String, required: true},
    createdAt: String,
    isMembership: Boolean
})

blogsSchema.methods.update = function (payload: BlogsInputModel) {
    this.name = payload.name;
    this.description = payload.description;
    this.websiteUrl = payload.websiteUrl;
}

export const BlogsModel = model<BlogsViewModel,BlogsModelType>('blogs', blogsSchema);